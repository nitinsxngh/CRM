import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import AdminTable from "../components/AdminTable";

import styles from "./Admin.module.css";

const Admin = () => {

  return (
    <div className={styles.dashboard}>
      <Header />
      <SideNavigation />
      <AdminTable />
    </div>
  );
};

export default Admin;
