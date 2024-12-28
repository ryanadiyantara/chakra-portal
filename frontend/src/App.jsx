import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import ForgotPassword from "./pages/forgotpassword";
import Dashboard from "./pages/dashboard";
import EmployeeDirectory from "./pages/employeedirectory";
import ChangePassword from "./pages/ess.changepassword";
import LeaveApp from "./pages/ess.leaveapp";
import MasterDepartment from "./pages/hr.masterdepartment";
import MasterPosition from "./pages/hr.masterposition";
import ManageEvent from "./pages/hr.manageevent";
import ManageEmployee from "./pages/hr.manageemployee";
import EmployeeTerminated from "./pages/hr.employeeterminated";
import LeaveApproval from "./pages/hr.leaveapproval";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employeedirectory" element={<EmployeeDirectory />} />
          <Route path="/ess/changepassword" element={<ChangePassword />} />
          <Route path="/ess/leaveapp" element={<LeaveApp />} />
          <Route path="/hr/masterdepartment" element={<MasterDepartment />} />
          <Route path="/hr/masterposition" element={<MasterPosition />} />
          <Route path="/hr/manageevent" element={<ManageEvent />} />
          <Route path="/hr/manageemployee" element={<ManageEmployee />} />
          <Route path="/hr/employeeterminated" element={<EmployeeTerminated />} />
          <Route path="/hr/leaveapproval" element={<LeaveApproval />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
