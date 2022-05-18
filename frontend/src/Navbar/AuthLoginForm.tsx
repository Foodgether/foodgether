import React from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import Swal from 'sweetalert2';
import { BACKEND_URL } from '../config';
import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from '../atoms';

export type AuthFormLoginValues = { phoneNumber: string; pin: string };
let formikRef: FormikProps<AuthFormLoginValues> | null;

const AuthLoginForm = () => {
  const [_, setUser] = useAtom(userAtom);
  const [__, setToken] = useAtom(tokenAtom);

  const handleClickSubmit = async () => {
    await formikRef?.submitForm();
  };
  return (
    <Formik<AuthFormLoginValues>
      innerRef={(ref) => {
        formikRef = ref;
      }}
      initialValues={{ phoneNumber: '', pin: '' }}
      onSubmit={async () => {
        const rawLoginResponse = await fetch(`${BACKEND_URL}/auth/login`, {
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
        if (!rawLoginResponse.ok) {
          const { message } = await rawLoginResponse.json();
          await Swal.fire({
            position: 'center',
            icon: 'error',
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }
        const loginResponse = await rawLoginResponse.json();
        setUser({ ...loginResponse.user, fetching: false, loggedIn: true });
        setToken(loginResponse.token);
        Swal.close();
      }}
    >
      <Form>
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
        <button
          onClick={handleClickSubmit}
          type="button"
          className="mt-5 max-w-xl max-h-24 text-3xl font-bold text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-800 rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Get Menu
        </button>
      </Form>
    </Formik>
  );
};

export default AuthLoginForm;
