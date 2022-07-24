import React from 'react'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import { BACKEND_URL } from '../config'
import { useSetAtom } from 'jotai'
import { tokenAtom, userAtom } from '../atoms'
import { Button, Input, Spacer } from '@nextui-org/react'

export type AuthFormRegisterValues = {
  phoneNumber: string
  name: string
  pin: string
}

const InputCss = {
  whiteSpace: 'nowrap',
  $$inputPlaceholderColor: 'black',
  $$inputTextColor: '$colors-primary',
}

const AuthRegisterForm = () => {
  const setUser = useSetAtom(userAtom)
  const setToken = useSetAtom(tokenAtom)

  const handleClickSubmit = async () => {
    await formik.submitForm()
  }

  const formik = useFormik<AuthFormRegisterValues>({
    initialValues: { phoneNumber: '', name: '', pin: '' },
    onSubmit: async () => {
      const rawRegisterResponse = await fetch(`${BACKEND_URL}/user`, {
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
      if (!rawRegisterResponse.ok) {
        const { message } = await rawRegisterResponse.json()
        await Swal.fire({
          position: 'center',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 1500,
        })
        return
      }
      const registerResponse = await rawRegisterResponse.json()
      setUser({ ...registerResponse.user, fetching: false, loggedIn: true })
      setToken(registerResponse.token)
      Swal.close()
    },
  })

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
        labelLeft='Name'
        aria-label='Name'
        placeholder='John Doe'
        color='primary'
        type='text'
        name='name'
        id='name'
        onChange={formik.handleChange}
        value={formik.values.name}
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
        Register
      </Button>
    </form>
  )
}

export default AuthRegisterForm
