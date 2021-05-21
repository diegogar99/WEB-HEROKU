import React from 'react'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from  'react-router-dom'
import logo from '../../../imagenes/logo.jpg'
import SvgIcon from '@material-ui/core/SvgIcon';
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    "& > svg": {
      margin: theme.spacing(2)
    }
  },

  menuButton: {
    marginRight: theme.spacing(2),
  }
}));

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

export default function SimpleMenu() {

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const vaciarLocalMem=e=>{
    ///localStorage.removeItem('categoria');
    localStorage.removeItem('ordenarPor');
    localStorage.removeItem('ordenarDe');
  };
  const handleClose = () => {
    setAnchorEl(null);
    vaciarLocalMem();
  };

  return (
    <div>
    <Toolbar className="Toolbar">

      <Link to="/paginaSecundaria" onClick={vaciarLocalMem}>
        <img className="logoEmpresa" src={logo} alt="Logo"/>
      </Link>

      <Link to="/paginaSecundaria/seguridad" onClick={vaciarLocalMem}>
        <Button>Seguridad</Button>
      </Link>
      <Link to="/paginaSecundaria/contraseñas" onClick={vaciarLocalMem} className="contrasenyaLink">
        <Button>Contraseñas</Button>
      </Link>
      <Link to="/paginaSecundaria/documentos" onClick={vaciarLocalMem}>
        <Button>Documentos</Button>
      </Link>
      <Link to="/paginaSecundaria/imagenes" onClick={vaciarLocalMem}>
        <Button>Imagenes</Button>
      </Link>  

      <IconButton className={classes.menuButton} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} edge="end" color="inherit" aria-label="menu">
      <MenuIcon/>
      </IconButton>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <Link to="/paginaSecundaria/administracion" className="opt">
          <MenuItem onClick={handleClose}>Administrar cuenta</MenuItem>
        </Link>
        <Link to="/paginaSecundaria/categorias" className="opt">
          <MenuItem onClick={handleClose}>Administrar categorias</MenuItem>
        </Link>
        <Link to="/paginaSecundaria/contacto" className="opt">
          <MenuItem onClick={handleClose}>Contacta con nosotros</MenuItem>
        </Link>
        <Link to="/paginaSecundaria/" className="opt">
          <MenuItem onClick={handleClose}>Ver contraseñas caducadas</MenuItem>
        </Link>
        <Link to="/" className="opt" onClick={vaciarLocalMem}>
          <MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
        </Link>
      </Menu>

    </Toolbar>
    </div>
  );
}
