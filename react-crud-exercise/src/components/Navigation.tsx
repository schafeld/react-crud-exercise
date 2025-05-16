import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { MegaMenu } from 'primereact/megamenu';
import { app } from '../firebase';
import { useAuthStatus } from '../hooks/useAuthStatus';
import './Navigation.css'; // Add this import for custom styles

export default function Navigation() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Build the menu items for MegaMenu
  const menuItems = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      command: () => navigate('/')
    },
    {
      label: 'About',
      icon: 'pi pi-fw pi-info-circle',
      command: () => navigate('/about')
    },
    {
      label: 'App',
      icon: 'pi pi-fw pi-th-large',
      command: () => navigate('/app')
    },
    {
      label: 'Offers',
      icon: 'pi pi-fw pi-tag',
      command: () => navigate('/offers')
    },
    {
      label: 'Account',
      icon: 'pi pi-fw pi-user',
      items: [
        [
          {
            label: loggedIn ? 'User Options' : 'Authentication',
            items: loggedIn
              ? [
                  { 
                    label: 'Profile', 
                    icon: 'pi pi-fw pi-user-edit',
                    command: () => navigate('/profile') 
                  },
                  { 
                    label: 'Log Out', 
                    icon: 'pi pi-fw pi-power-off',
                    command: () => handleLogout() 
                  }
                ]
              : [
                  { 
                    label: 'Sign In', 
                    icon: 'pi pi-fw pi-sign-in',
                    command: () => navigate('/signin') 
                  },
                  { 
                    label: 'Sign Up', 
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => navigate('/signup') 
                  },
                  { 
                    label: 'Forgot Password', 
                    icon: 'pi pi-fw pi-lock',
                    command: () => navigate('/forgot-password') 
                  }
                ]
          }
        ]
      ]
    }
  ];

  if (checkingStatus) {
    return null;
  }

  return (
    <div className="mt-4 custom-megamenu-wrapper">
      <MegaMenu 
        model={menuItems} 
        orientation="horizontal" 
        className="w-full custom-megamenu" 
        breakpoint="960px"
      />
    </div>
  );
}
