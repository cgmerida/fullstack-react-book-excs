import React from 'react';
import { NavLink } from 'react-router-dom';

import '../styles/VerticalMenu.css';

const VerticalMenu = ({ albums, albumsPathname }) => (
  <div className='ui secondary vertical menu'>
    <div className='header item'>
      Albums
    </div>
    {albums.map((album) => (
      <NavLink key={album.id}
        className='item'
        to={`${albumsPathname}/${album.id}`}
      >
        {album.name}
      </NavLink>
      // <Link className={`item ${path.slice(path.lastIndexOf('/') + 1) === album.id ? 'active' : ''}`}
      //   to={`${albumsPathname}/${album.id}`}
      //   key={album.id}>
      //   {album.name}
      // </Link>
    ))}
  </div>
);

export default VerticalMenu;
