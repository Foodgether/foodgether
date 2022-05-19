import React from 'react';
import { Container, Spacer } from '@nextui-org/react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms';
import ProfileForm from './ProfileForm';

enum ProfileTab {
  PROFILE = 0,
  ORDERS = 1,
}

const Profile = () => {
  return (
    <Container
      fluid
      justify="center"
      alignItems="center"
      css={{ p: 50, height: '800px' }}
    >
      <Spacer y={2} />
      <Tabs defaultIndex={ProfileTab.PROFILE}>
        <TabList>
          <Tab className="react-tabs__tab text-xl font-bold text-pink-900">
            PROFILE
          </Tab>
          <Tab className="react-tabs__tab text-xl font-bold text-pink-900">
            ORDERS
          </Tab>
        </TabList>

        <TabPanel>
          <ProfileForm />
        </TabPanel>
        <TabPanel>
          <></>
        </TabPanel>
      </Tabs>
    </Container>
  );
};

export default Profile;
