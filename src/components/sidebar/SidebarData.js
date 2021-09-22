import LinkIcon from '@mui/icons-material/Link';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import InfoIcon from '@mui/icons-material/Info';

const color = {color: 'white'};
const size = 'large';

export const SidebarData = [
    {
      id: 1,
      title: 'Url',
      icon: <LinkIcon style={color} fontSize={size} />,
      link: '/',
    },
    {
      id: 2,
      title: 'File',
      icon: <InsertDriveFileIcon style={color} fontSize={size} />,
      link: '/file',
    },
    {
      id: 3,
      title: 'About Us',
      icon: <InfoIcon style={color} fontSize={size} />,
    },
  ];
  
  export default SidebarData;