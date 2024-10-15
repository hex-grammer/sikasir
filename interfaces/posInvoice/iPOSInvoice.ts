import { iInvoiceItem } from "./iInvoiceItem";
import { iPaymentDetails } from "./iPaymentDetails";
import { iTaxDetails } from "./iTaxDetails";

export interface iPOSInvoice {
    // Accounts and Discounts
    account_for_change_amount: string;
    additional_discount_percentage: number;
    discount_amount: number;
    apply_discount_on: string;  // e.g., "Grand Total"
    base_discount_amount: number;  // e.g., 0
    write_off_amount: number;
    base_write_off_amount: number;
    write_off_account: string;
    write_off_cost_center: string;
    rounding_adjustment: number;
    base_rounding_adjustment: number;
  
    // General Information
    customer: string;
    customer_name: string;
    company: string;
    currency: string;
    pos_profile: string;  // e.g., "CASH CANVAS (PALANGKA) DEWI SINTA"
    total_qty: number;
    status: string;
    set_warehouse: string;
    language: string;
    group_same_items: number;  // 0 or 1
    debit_to: string;  // e.g., "1131.1010 - Piutang Dagang - MMPP"
    party_account_currency: string;
    is_opening: string;  // e.g., "No"
    
    // POS and Payment Details
    is_pos: number;
    is_return: number;  // e.g., 0 or 1
    paid_amount: number;
    base_paid_amount: number;
    outstanding_amount: number;
    total_advance: number;
    payment_schedule: any[];
    payments: iPaymentDetails[];
  
    // Invoice Information
    name: string;
    naming_series: string;
    custom_pos_invoice_number: string;
    remarks: string | null;
    title: string;  // e.g., "{customer_name}"
    idx: number;  // Index in system, e.g., 0
    docstatus: number;
    timesheets: any[];
    doctype: string;  // e.g., "POS Invoice"
  
    // Taxes and Charges
    taxes_and_charges: string;
    total_taxes_and_charges: number;
    base_total_taxes_and_charges: number;
    other_charges_calculation: string;
    tax_category: string;
    taxes: iTaxDetails[];
  
    // Contact Information
    contact_display: string;
    contact_mobile: string;
    contact_email: string;
    contact_person: string;
    customer_address: string | null;
  
    // Date and Time
    creation: string;
    modified: string;
    modified_by: string;
    posting_date: string;
    posting_time: string;
    due_date: string;
    set_posting_time: number;
  
    // Pricing Information
    selling_price_list: string;
    price_list_currency: string;
    plc_conversion_rate: number;
    conversion_rate: number;
    ignore_pricing_rule: number;
    base_net_total: number;
    net_total: number;
    base_grand_total: number;
    grand_total: number;
    base_rounded_total: number;
    rounded_total: number;
    in_words: string;
    base_in_words: string;
    base_total: number;
    total: number;
    base_net_rate: number;
    base_net_amount: number;
  
    // Miscellaneous
    base_change_amount: number;
    change_amount: number;
    is_discounted: number;
    items: iInvoiceItem[];
    advances: any[];
    pricing_rules: any[];
    sales_team: any[];
    total_commission: number;
    amount_eligible_for_commission: number;
    commission_rate: number;
    total_net_weight: number;
    packed_items: any[];
    update_stock: number;
    update_billed_amount_in_sales_order: number;
    update_billed_amount_in_delivery_note: number;
    __onload: { make_payment_via_journal_entry: number };
    __last_sync_on: string;
  }