"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Order, OrderLine, OrderStatus } from "@/types";
import {
  cancelOrder,
  fetchOrder,
  fetchOrders,
  placeOrder,
  updateOrderLines,
  updateOrderStatus,
  updateStaffNote,
  type PlaceOrderInput,
} from "../api";

export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export function useOrders() {
  return useQuery({ queryKey: orderKeys.list(), queryFn: fetchOrders });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrder(id),
    enabled: id.length > 0,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, PlaceOrderInput>({
    mutationFn: placeOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

interface OrderListSnapshot {
  previous: Order[] | undefined;
}

/**
 * Moving a ticket must feel instantaneous on a busy bar, so the board updates
 * before the write resolves and reverts if it throws.
 */
export function useAdvanceOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Order,
    Error,
    { id: string; status: OrderStatus },
    OrderListSnapshot
  >({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.list() });
      const previous = queryClient.getQueryData<Order[]>(orderKeys.list());

      queryClient.setQueryData<Order[]>(orderKeys.list(), (orders) =>
        orders?.map((order) =>
          order.id === id ? { ...order, status } : order,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(orderKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

/**
 * Same optimistic treatment, but this one really can fail — see
 * `CANCEL_FAILURE_RATE` in the orders api. The board shows the ticket back in
 * its old column and the caller raises an error toast.
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<
    Order,
    Error,
    { id: string; reason: string },
    OrderListSnapshot
  >({
    mutationFn: ({ id, reason }) => cancelOrder(id, reason),
    onMutate: async ({ id, reason }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.list() });
      const previous = queryClient.getQueryData<Order[]>(orderKeys.list());

      queryClient.setQueryData<Order[]>(orderKeys.list(), (orders) =>
        orders?.map((order) =>
          order.id === id
            ? { ...order, status: "cancelled", cancellationReason: reason }
            : order,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(orderKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrderLines() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: string; lines: OrderLine[] }>({
    mutationFn: ({ id, lines }) => updateOrderLines(id, lines),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateStaffNote() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: string; staffNote: string }>({
    mutationFn: ({ id, staffNote }) => updateStaffNote(id, staffNote),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
