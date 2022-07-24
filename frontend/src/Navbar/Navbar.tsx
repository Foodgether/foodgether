import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../logo.png'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AuthForm from './AuthForm'
import { useAtom, useSetAtom } from 'jotai'
import { BACKEND_URL, BASE_PATH } from '../config'
import { useLocation, useNavigate } from 'react-router'
import { Button, Grid, Loading, Spacer, User } from '@nextui-org/react'
import { initialOrderAtomValue, orderAtom, tokenAtom, userAtom } from '../atoms'
const AuthFormSwal = withReactContent(Swal)

const Navbar: FC = () => {
  const setToken = useSetAtom(tokenAtom)
  const [user, setUser] = useAtom(userAtom)
  const setOrder = useSetAtom(orderAtom)
  const location = useLocation()
  const navigate = useNavigate()

  const showAuthForm = () => {
    AuthFormSwal.fire({
      html: <AuthForm />,
      didOpen: () => {
        Swal?.getPopup()?.querySelector('input')?.focus()
      },
      showConfirmButton: false,
    })
  }

  const handleLogout = async () => {
    const rawLogoutResponse = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!rawLogoutResponse.ok) {
      const { message } = await rawLogoutResponse.json()
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      })
      return
    } else {
      await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Logout successfully',
        showConfirmButton: false,
        timer: 1500,
      })
      setToken('')
      setUser({ fetching: false, loggedIn: false })
      setOrder({ ...initialOrderAtomValue })
    }
    if (location.pathname !== '/') {
      navigate(BASE_PATH)
    }
  }
  return (
    <nav>
      <Grid.Container
        xl
        gap={0}
        css={{
          background: '$gradient',
          top: 0,
          left: 0,
          width: '100%',
        }}
      >
        <Grid xs={12} md={3} justify='center'>
          <Link to={`${BASE_PATH}`} className='flex items-center object-contain h-full'>
            <img className='object-contain max-w-xs' src={Logo} />
          </Link>
        </Grid>
        <Grid xs={0} md={5} />
        <Grid xs={12} md={4} justify='center' alignItems='center'>
          {!user.loggedIn && (
            <Button onClick={showAuthForm} bordered ghost>
              {user.fetching ? <Loading color='currentColor' size='sm' /> : 'Register/Login'}
            </Button>
          )}
          {user.loggedIn && 'id' in user && (
            <>
              <Link to={`${BASE_PATH}/profile`}>
                <User src='https://i.pravatar.cc/150?u=a042581f4e29026704d' name={user.name} />
              </Link>
              <Spacer x={1} />
              <Button onClick={handleLogout} bordered ghost>
                Logout
              </Button>
            </>
          )}
        </Grid>
      </Grid.Container>
    </nav>
  )
}

export default Navbar
