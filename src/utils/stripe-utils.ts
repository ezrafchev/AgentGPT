import type Stripe from "stripe";

type CustomerType = string | Stripe.Customer | Stripe.DeletedCustomer;

const getCustomerId = (customer: CustomerType) => {
  if (!customer) throw new Error("No customer found");

  return typeof customer === "string" ? customer : customer.id;
};

const getCustomerEmail = async (stripe: Stripe, customer: CustomerType) => {
  if (!customer) throw new Error("No customer found");

  const c = typeof customer === "string" ? await stripe.customers.retrieve(customer) : customer;

  return (c as Stripe.Customer).email ?? "";
};

