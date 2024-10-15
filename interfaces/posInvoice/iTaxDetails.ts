// Sub-interface for Taxes
export interface iTaxDetails {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    charge_type: string;
    account_head: string;
    description: string;
    included_in_print_rate: number;
    included_in_paid_amount: number;
    cost_center: string;
    rate: number;
    account_currency: string;
    tax_amount: number;
    total: number;
    tax_amount_after_discount_amount: number;
    base_tax_amount: number;
    base_total: number;
    base_tax_amount_after_discount_amount: number;
    item_wise_tax_detail: string;
    dont_recompute_tax: number;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
  }