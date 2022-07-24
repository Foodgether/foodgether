import React from 'react'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import { BACKEND_URL } from '../config'
import { useSetAtom } from 'jotai'
import { tokenAtom, userAtom } from '../atoms'
import { Button, Input, Spacer } from '@nextui-org/react'

export type AuthFormLoginValues = { phoneNumber: string; pin: string }

const InputCss = {
  whiteSpace: 'nowrap',
  $$inputPlaceholderColor: 'black',
  $$inputTextColor: '$colors-primary',
}

const AuthLoginForm = () => {
  const setUser = useSetAtom(userAtom)
  const setToken = useSetAtom(tokenAtom)

  const formik = useFormik<AuthFormLoginValues>({
    initialValues: { phoneNumber: '', pin: '' },
    onSubmit: async () => {
      const rawLoginResponse = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          ...formik.values,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      if (!rawLoginResponse.ok) {
        const { message } = await rawLoginResponse.json()
        await Swal.fire({
          position: 'center',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 1500,
        })
        return
      }
      const loginResponse = await rawLoginResponse.json()
      setUser({ ...loginResponse.user, fetching: false, loggedIn: true })
      setToken(loginResponse.token)
      Swal.close()
    },
  })

  const handleClickSubmit = async () => {
    await formik.submitForm()
  }

  return (
    <form>
      <Input
        rounded
        bordered
        fullWidth
        labelLeft='Phone Number'
        aria-label='Phone Number'
        placeholder='0123456789'
        color='primary'
        type='text'
        name='phoneNumber'
        id='phoneNumber'
        onChange={formik.handleChange}
        value={formik.values.phoneNumber}
        css={InputCss}
      />
      <Spacer y={1} />

      <Input
        rounded
        bordered
        fullWidth
        labelLeft='PIN'
        aria-label='PIN'
        placeholder='1234'
        color='primary'
        type='password'
        name='pin'
        id='pin'
        onChange={formik.handleChange}
        value={formik.values.pin}
        css={InputCss}
      />
      <Spacer y={1} />
      <Button onClick={handleClickSubmit} ghost color='gradient' css={{ margin: 'auto' }}>
        Login
      </Button>
    </form>
  )
}

export default AuthLoginForm
