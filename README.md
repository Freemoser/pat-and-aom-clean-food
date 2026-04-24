# Pat & Aum Clean Food Website

A modern, responsive restaurant website with a dedicated meal prep ordering system.

## Features

### Main Website (`index.html`)
- **Hero Section**: Eye-catching landing area with call-to-action buttons
- **Menu Display**: Grid layout showcasing signature dishes with images and pricing
- **About Section**: Restaurant story and philosophy
- **Contact Information**: Location, hours, and reservation details
- **Responsive Navigation**: Mobile-friendly hamburger menu
- **Smooth Scrolling**: Seamless navigation between sections

### Meal Prep Ordering System (`meal-prep.html`)
- **Pack Selection**: Order meal prep packs (x5/x10/trial)
- **Menu Customization**: Filter packs by category (bowls, wraps, trial)
- **Shopping Cart**: Add packs to cart with quantity selection
- **Nutritional Information**: Calorie and macronutrient display for each meal
- **Responsive Design**: Works seamlessly on all devices

## Technologies Used

- **HTML5**: Semantic markup for accessibility and SEO
- **CSS3**: Modern styling with flexbox and grid layouts
- **Vanilla JavaScript**: No frameworks required for fast loading
- **Google Fonts**: Playfair Display and Roboto for typography
- **Unsplash Images**: High-quality food photography

## File Structure

```
windsurf-project/
|-- index.html              # Main restaurant homepage
|-- meal-prep.html          # Meal prep ordering page
|-- styles.css              # Comprehensive styling
|-- script.js               # Main site functionality
|-- meal-prep.js            # Meal prep specific functionality
|-- README.md               # This file
```

## Key Features

### Navigation
- Fixed header with smooth scroll navigation
- Active section highlighting
- Mobile-responsive hamburger menu
- Direct navigation to meal prep from main site

### Meal Prep System

### Walk-in Menu
- Walk-in meals with THB pricing and macros per serve

### Meal Categories
- All Packs
- Bowls
- Wraps
- Trial

### Interactive Elements
- Quantity selection for each meal
- Add to cart functionality
- Real-time cart updates
- Remove items from cart
- Total price calculation

## Responsive Design

The website is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## Getting Started

1. Clone or download the project files
2. Open `index.html` in your web browser to view the main restaurant site
3. Navigate to `meal-prep.html` to access the meal prep ordering system

## Customization

### Adding New Meals
To add new meals to the meal prep system:
1. Add new meal items to the `.meals-grid` in `meal-prep.html`
2. Keep `data-price`, `data-currency` and macro `data-*` attributes updated
3. Add appropriate data categories for filtering

### Styling Changes
All styling is contained in `styles.css`. The CSS is organized into clear sections:
- Base styles and typography
- Navigation components
- Button styles
- Section-specific styling
- Responsive breakpoints

## Browser Compatibility

The website is tested and compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features to add:
- Online payment integration
- User account system
- Order history tracking
- Dietary preference filtering
- Delivery scheduling
- Customer reviews and ratings
- Email confirmation system

## License

This project is open source and available under the MIT License.
