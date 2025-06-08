// import React from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import BottomNav from '../components/BottomNav';
// import LanguageSelector from '../components/LanguageSelector/LanguageSelector';
//
// const MainLayout: React.FC = () => {
//   const navigate = useNavigate();
//
//   const handleLogoClick = () => {
//     navigate('/');
//   };
//
//   return (
//     <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <header
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           height: '45px',
//           background: 'white',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           padding: '0 16px',
//           borderBottom: '1px solid #eee',
//           zIndex: 1000,
//         }}
//       >
//         <button
//           onClick={handleLogoClick}
//           style={{
//             background: 'none',
//             border: 'none',
//             padding: 0,
//             margin: 0,
//             cursor: 'pointer',
//             color: 'inherit',
//             font: 'inherit',
//             height: '100%',
//             display: 'flex',
//             alignItems: 'center',
//           }}
//         >
//           <h1 style={{ margin: 0, fontSize: '1.2em', fontWeight: 'bold' }}>셔틀요정</h1>
//         </button>
//         <LanguageSelector />
//       </header>
//       <main style={{
//         marginTop: '45px',
//         marginBottom: '50px',
//         flex: 1
//       }}>
//         <Outlet />
//       </main>
//       <BottomNav />
//     </div>
//   );
// };
//
// export default MainLayout;