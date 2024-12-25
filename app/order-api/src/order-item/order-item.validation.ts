import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const ORDER_ITEM_NOT_FOUND = 'ORDER_ITEM_NOT_FOUND';
export const ORDER_ITEM_NOT_BELONG_TO_ANY_ORDER =
  'ORDER_ITEM_NOT_BELONG_TO_ANY_ORDER';
export const REQUEST_ORDER_ITEM_GREATER_ORDER_ITEM_QUANTITY =
  'REQUEST_ORDER_ITEM_GREATER_ORDER_ITEM_QUANTITY';
export const ALL_ORDER_ITEM_MUST_BELONG_TO_A_ORDER =
  'ALL_ORDER_ITEM_MUST_BELONG_TO_A_ORDER';

export type TOrderItemErrorCodeKey =
  | typeof ORDER_ITEM_NOT_FOUND
  | typeof ORDER_ITEM_NOT_BELONG_TO_ANY_ORDER
  | typeof REQUEST_ORDER_ITEM_GREATER_ORDER_ITEM_QUANTITY
  | typeof ALL_ORDER_ITEM_MUST_BELONG_TO_A_ORDER;

export type TOrderItemErrorCode = Record<
  TOrderItemErrorCodeKey,
  TErrorCodeValue
>;

// 131000 - 132000
export const OrderItemValidation: TOrderItemErrorCode = {
  ORDER_ITEM_NOT_FOUND: createErrorCode(1031, 'Order item not found'),
  ORDER_ITEM_NOT_BELONG_TO_ANY_ORDER: createErrorCode(
    131000,
    'Order item not belong to any order',
  ),
  REQUEST_ORDER_ITEM_GREATER_ORDER_ITEM_QUANTITY: createErrorCode(
    131001,
    'Request order item greater order item quantity',
  ),
  ALL_ORDER_ITEM_MUST_BELONG_TO_A_ORDER: createErrorCode(
    131002,
    'All order item must belong to a order',
  ),
};
