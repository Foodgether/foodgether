import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms';
import { Field, Form, Formik, FormikProps } from 'formik';
import { AuthFormRegisterValues } from '../Navbar/AuthRegisterForm';
import { BACKEND_URL } from '../config';
import Swal from 'sweetalert2';
import { Button, Container, Spacer } from '@nextui-org/react';

let formikRef: FormikProps<AuthFormRegisterValues> | null;

const ProfileForm = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isShowingSpinner, setShowingSpinner] = useState(false);
  const isAuthenticated = 'id' in user;
  if (!isAuthenticated) {
    return <></>;
  }
  return (
    <Container css={{ px: '$24' }}>
      <Formik<AuthFormRegisterValues>
        innerRef={(ref) => {
          formikRef = ref;
        }}
        initialValues={{
          phoneNumber: user.phoneNumber,
          name: user.name,
          pin: '',
        }}
        onSubmit={async () => {
          const rawRegisterResponse = await fetch(`${BACKEND_URL}/user`, {
            method: 'POST',
            body: JSON.stringify({
              ...formikRef?.values,
            }),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          if (!rawRegisterResponse.ok) {
            const { message } = await rawRegisterResponse.json();
            await Swal.fire({
              position: 'center',
              icon: 'error',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
            return;
          }
          Swal.close();
        }}
      >
        <Form>
          <div>
            <label
              htmlFor="name"
              className="text-xl font-bold text-pink-900 my-10"
            >
              Name
            </label>
            <Field
              type="text"
              name="name"
              id="name"
              className="focus:outline-pink-900 text-2xl border rounded-lg block w-full p-2.5 bg-gray-100 border-pink-900 placeholder-gray-400 placeholder:text-lg text-pink-900 font-semibold"
              placeholder="Bonnie Green"
            />
          </div>
          <div className="mt-2">
            <label
              htmlFor="phoneNumber"
              className="text-xl font-bold text-pink-900 my-10"
            >
              Phone number
            </label>
            <Field
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              className="focus:outline-pink-900 text-2xl border rounded-lg block w-full p-2.5 bg-gray-100 border-pink-900 placeholder-gray-400 placeholder:text-lg text-pink-900 font-semibold"
              placeholder="Bonnie Green"
            />
          </div>
          <div>
            <label
              htmlFor="pin"
              className="text-xl font-bold text-pink-900 my-10"
            >
              PIN
            </label>
            <Field
              type="password"
              name="pin"
              id="pin"
              className="focus:outline-pink-900 text-2xl border rounded-lg block w-full p-2.5 bg-gray-100 border-pink-900 placeholder-gray-400 placeholder:text-lg text-pink-900 font-semibold"
            />
          </div>
          <Spacer y={1} />
          <Button
            onPress={() => {}}
            color="gradient"
            auto
            ghost
            css={{ width: '10em', margin: 'auto' }}
            disabled={isShowingSpinner}
          >
            Get Menu
          </Button>
        </Form>
      </Formik>
    </Container>
  );
};

export default ProfileForm;
