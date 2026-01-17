import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import Dashboard from './pages/Dashboard'

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import {Layout} from './components/refine-ui/layout/layout'
import { dataProvider } from "./providers/data";
import {BookOpen, Home } from 'lucide-react'
import SubjectsList from "./pages/Subjects/list";
import SubjectsCreate from "./pages/Subjects/Create";

function App() {
  return (
    <BrowserRouter>
     <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "dpGD9O-dnu4kZ-8XEz6c",
              }}

              resources={[
               {              
                name:"dashboard", list:'/', 
                meta:{lable: "Home",icon: <Home />}
               },
               {
                  name:"Subjects", list:'Subjects',
                  create: 'Subject/create',
                  meta: {lable: "Subjects", icon: <BookOpen/>}
                }
              ]}
            >
              <Routes>
                <Route element = {
                  <Layout>
                    <Outlet />
                  </Layout>
                }>
                <Route  path = "/" element={<Dashboard />} />
                <Route path = "Subjects" >
                  <Route index element={<SubjectsList/>}></Route>
                  <Route path="create" element={<SubjectsCreate/>}></Route>
                </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
