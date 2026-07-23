# @runme/cli

Display your portfolio in the terminal.

## Installation

```bash
npx @runme/cli <username>
```

## Features

- Interactive menu with arrow key navigation
- 6 beautiful color themes (Cyberpunk, Dracula, Gruvbox, Nord, Monokai, Tokyo Night)
- 15 text animations for boot sequence
- Offline support with 24-hour cache
- GitHub stats integration
- Custom ASCII banner support

## Commands

```bash
# Display a portfolio
npx @runme/cli johndoe

# Set theme
npx @runme/cli theme dracula

# Set animation
npx @runme/cli animation matrix

# Run diagnostics
npx @runme/cli doctor

# Check for updates
npx @runme/cli update
```

## Available Themes

- `cyberpunk` - Neon cyan, magenta, yellow on dark
- `dracula` - Purple, pink, cyan on dark
- `gruvbox` - Orange, green, yellow on dark brown
- `nord` - Blue tones on dark blue
- `monokai` - Pink, green, yellow on dark
- `tokyonight` - Soft purple/blue on dark

## Available Animations

- `typewriter` - Characters appear one by one
- `matrix` - Green falling characters
- `glitch` - Random character distortion
- `wave` - Text ripples like water
- `fadeIn` - Text fades in from transparent
- `scanLine` - Horizontal line scans across text
- `decrypt` - Random chars resolve to final text
- `neonGlow` - Text pulses with glow effect
- `bounceIn` - Text bounces into view
- `slideIn` - Text slides from direction
- `colorCycle` - Text colors cycle through spectrum
- `pixelate` - Text pixelates then resolves
- `typewriterDelete` - Types then deletes then retypes
- `fire` - Orange/red flame effect
- `rainbowWave` - Rainbow colors wave across text

## Configuration

Configuration is stored in `~/.runme/config.json`.

## License

MIT
