import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { MegaMenu } from 'primereact/megamenu';
import { MenuItem } from 'primereact/menuitem';
import { app } from '../firebase';
import { useAuthStatus } from '../hooks/useAuthStatus';
import './Navigation.css'; // Add this import for custom styles

export default function Navigation() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const auth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return currentPath === path;
  };
  
  // Navigation handler that stops event propagation
  // Interface for navigation handler parameters
  interface NavigationEvent {
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
    path: string;
  }

  // Navigation handler that stops event propagation
  const handleNavigate = (e: NavigationEvent['e'], path: NavigationEvent['path']): void => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to PrimeReact handlers
    navigate(path);
  };

  // Build the menu items for MegaMenu with correct active state
  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      template: (item) => {
        return (
          <a 
            href="#" 
            className={`p-menuitem-link ${isActive('/') ? 'active-link' : ''}`}
            onClick={(e) => handleNavigate(e, '/')}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus
          >
            <span className={`p-menuitem-icon pi pi-fw pi-home`}></span>
            <span className="p-menuitem-text">{item.label}</span>
          </a>
        );
      }
    },
    {
      label: 'About',
      icon: 'pi pi-fw pi-info-circle',
      template: (item) => {
        return (
          <a 
            href="#" 
            className={`p-menuitem-link ${isActive('/about') ? 'active-link' : ''}`}
            onClick={(e) => handleNavigate(e, '/about')}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus
          >
            <span className={`p-menuitem-icon pi pi-fw pi-info-circle`}></span>
            <span className="p-menuitem-text">{item.label}</span>
          </a>
        );
      }
    },
    {
      label: 'App',
      icon: 'pi pi-fw pi-th-large',
      template: (item) => {
        return (
          <a 
            href="#" 
            className={`p-menuitem-link ${isActive('/app') ? 'active-link' : ''}`}
            onClick={(e) => handleNavigate(e, '/app')}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus
          >
            <span className={`p-menuitem-icon pi pi-fw pi-th-large`}></span>
            <span className="p-menuitem-text">{item.label}</span>
          </a>
        );
      }
    },
    {
      label: 'Offers',
      icon: 'pi pi-fw pi-tag',
      template: (item) => {
        return (
          <a 
            href="#" 
            className={`p-menuitem-link ${isActive('/offers') ? 'active-link' : ''}`}
            onClick={(e) => handleNavigate(e, '/offers')}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus
          >
            <span className={`p-menuitem-icon pi pi-fw pi-tag`}></span>
            <span className="p-menuitem-text">{item.label}</span>
          </a>
        );
      }
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
                    command: (e) => {
                      e.originalEvent.stopPropagation();
                      navigate('/profile');
                    },
                    className: isActive('/profile') ? 'active-menu-item' : ''
                  },
                  { 
                    label: 'Log Out', 
                    icon: 'pi pi-fw pi-power-off',
                    command: (e) => {
                      e.originalEvent.stopPropagation();
                      handleLogout();
                    }
                  }
                ]
              : [
                  { 
                    label: 'Sign In', 
                    icon: 'pi pi-fw pi-sign-in',
                    command: (e) => {
                      e.originalEvent.stopPropagation();
                      navigate('/signin');
                    },
                    className: isActive('/signin') ? 'active-menu-item' : ''
                  },
                  { 
                    label: 'Sign Up', 
                    icon: 'pi pi-fw pi-user-plus',
                    command: (e) => {
                      e.originalEvent.stopPropagation();
                      navigate('/signup');
                    },
                    className: isActive('/signup') ? 'active-menu-item' : ''
                  },
                  { 
                    label: 'Forgot Password', 
                    icon: 'pi pi-fw pi-lock',
                    command: (e) => {
                      e.originalEvent.stopPropagation();
                      navigate('/forgot-password');
                    },
                    className: isActive('/forgot-password') ? 'active-menu-item' : ''
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
