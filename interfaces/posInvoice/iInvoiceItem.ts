// Sub-interface for Items
export interface iInvoiceItem {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    has_item_scanned: number;
    item_code: string;
    item_name: string;
    description: string;
    item_group: string;
    brand: string;
    image: string;
    qty: number;
    stock_uom: string;
    uom: string;
    conversion_factor: number;
    stock_qty: number;
    price_list_rate: number;
    base_price_list_rate: number;
    rate: number;
    amount: number;
    net_rate: number;
    net_amount: number;
    base_net_rate: number;
    base_net_amount: number;
    discount_percentage: number;
    discount_amount: number;
    margin_type: string;
    margin_rate_or_amount: number;
    rate_with_margin: number;
    item_tax_template: string;
    pricing_rules: string;
    warehouse: string;
    serial_and_batch_bundle: string;
    cost_center: string;
    income_account: string;
    expense_account: string;
    is_free_item: number;
    delivered_by_supplier: number;
    grant_commission: number;
    item_tax_rate: string;
    actual_batch_qty: number;
    actual_qty: number;
    batch_no: string;
    delivered_qty: number;
    total_weight: number;
    page_break: number;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
  }