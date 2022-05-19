import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AuthLoginForm from './AuthLoginForm';
import AuthRegisterForm from './AuthRegisterForm';

enum tab {
  REGISTER = 0,
  LOGIN = 1,
}

const AuthForm = () => {
  return (
    <Tabs defaultIndex={tab.REGISTER}>
      <TabList>
        <Tab className="react-tabs__tab text-xl font-bold text-pink-900">
          Register
        </Tab>
        <Tab className="react-tabs__tab text-xl font-bold text-pink-900">
          Login
        </Tab>
      </TabList>

      <TabPanel>
        <AuthRegisterForm />
      </TabPanel>
      <TabPanel>
        <AuthLoginForm />
      </TabPanel>
    </Tabs>
  );
};

export default AuthForm;
