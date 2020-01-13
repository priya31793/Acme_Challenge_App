import Dashboard from "views/Dashboard.jsx";
import Customer from "views/Customer.jsx";
import CustomerDetail from "views/CustomerDetail";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/customer",
    name: "Customer",
    icon: "pe-7s-note2",
    component: Customer,
    layout: "/admin"
  },
  {
    path: "/customer_detail/:id",
    name: "Customer Detail",
    icon: "pe-7s-bell",
    component: CustomerDetail,
    layout: "/admin",
    redirect: true
  }
];

export default dashboardRoutes;
