/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // function({ addComponents }) {
    // 	addComponents({
    // 	  '.file-divider': {
    // 		borderTop: '2px dashed #ccc',
    // 		margin: '2rem 0',
    // 		padding: '1rem 0',
    // 		position: 'relative',
    // 		'&::before': {
    // 		  content: 'attr(data-filename)',
    // 		  position: 'absolute',
    // 		  top: '-0.8em',
    // 		  left: '1em',
    // 		  background: 'white',
    // 		  padding: '0 0.5em',
    // 		  color: '#666',
    // 		  fontStyle: 'italic',
    // 		  fontSize: '0.9em'
    // 		}
    // 	  }
    // 	});
    //   }
  ],
};
