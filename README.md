# ⚾ Victor Lebron Little League - Baseball Scorecard

A professional digital baseball scorecard application designed for tracking game statistics, player performance, and match progression with advanced sequential gameplay enforcement.

## 🚀 Features

### Core Functionality

- **Sequential Inning Enforcement** - Players must complete innings in order (no skipping)
- **Sequential Click Cycling** - Each cell progresses through: Clear → H → D → T → R → E → O → Clear
- **Dual Team Support** - Track both HOME and VISITING teams (13 players each)
- **Extended Innings** - Support for up to 14 innings for extra-long games
- **Real-time Scoring** - Automatic score calculation with visual feedback
- **Data Persistence** - Auto-save functionality using localStorage
- **Professional Printing** - Print-optimized scorecard layout

### User Experience

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Intuitive Interface** - Clear visual feedback and user-friendly controls
- **Error Prevention** - Smart validation prevents common user mistakes
- **Game Notes** - Built-in text area for additional game information
- **PWA Support** - Can be installed as a web app on mobile devices

## 🎯 Usage Instructions

### Starting a New Game

1. Open the application in your web browser
2. Enter team names and game date in the header
3. Begin clicking inning cells to record player actions

### Recording Player Actions

1. **Sequential Rule**: Complete inning 1 before moving to inning 2, etc.
2. **Click Cycling**: Each click advances through the action sequence:
   - Empty (Clear) → Hit (H) → Double (D) → Triple (T) → Run (R) → Error (E) → Out (O) → Back to Clear
3. **Visual Feedback**: Each action has distinct colors and letter indicators

### Managing Scores

- Use the + and - buttons to manually adjust team scores
- Scores are automatically saved and persist between sessions
- Score changes include visual animations for better feedback

### Saving and Printing

- **Auto-save**: Game data is automatically saved as you play
- **Print**: Use the "Print Scorecard" button for professional output
- **Clear**: Reset the entire scorecard when starting a new game

## 🔧 Technical Specifications

### Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance Features

- Hardware-accelerated animations
- Debounced auto-save (300ms delay)
- Efficient DOM manipulation
- Optimized CSS with performance hints

### Data Structure

```javascript
gameData = {
  home: {
    1: { name: "Player Name", position: "Position", 1: "hit", 2: "run", ... },
    2: { ... },
    ...
  },
  visiting: { ... },
  homeTeam: "Team Name",
  visitingTeam: "Team Name",
  gameDate: "YYYY-MM-DD",
  gameNotes: "Game notes text"
}
```

## 🛠️ Installation & Deployment

### Local Development

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. No build process required - runs directly in the browser

### Production Deployment

1. Upload all files to your web server:
   - `index.html`
   - `script.js`
   - `styles.css`
   - `manifest.json`
   - `apple-touch-icon.png`
2. Ensure HTTPS is enabled for PWA features
3. Configure server to serve with appropriate MIME types

### PWA Installation

- Users can install the app on mobile devices via the browser's "Add to Home Screen" option
- Works offline once cached by the browser

## 📱 Mobile Optimization

- Touch-friendly interface with appropriate button sizes
- Horizontal scrolling for inning columns on small screens
- Responsive typography and spacing
- iOS/Android home screen icon support

## 🎨 Customization

### Team Branding

- Update the header title in `index.html`
- Modify color scheme in `styles.css` (look for CSS custom properties)
- Replace `apple-touch-icon.png` with your league's logo

### Game Rules

- Modify the action sequence in `script.js` (`getNextAction` method)
- Adjust the number of players or innings as needed
- Customize validation rules in the `isInningAllowed` method

## 🔒 Data Privacy

- All game data is stored locally in the user's browser
- No data is transmitted to external servers
- Users maintain full control over their game information
- Data persists until manually cleared or browser storage is reset

## 📞 Support

For technical support or feature requests related to this baseball scorecard application, please contact your league's technical administrator.

## 📄 License

This application is designed specifically for Victor Lebron Little League. Usage terms and distribution rights are subject to league policies.

---

**Version**: 2.0 - Production Ready  
**Last Updated**: December 2024  
**Compatibility**: Modern browsers with ES6+ support
