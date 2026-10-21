# FitsRight

FitsRight is a project I'm building to make it easier to check whether a laptop and a docking station will work together.

Choosing accessories for a laptop can get confusing, especially when you're not sure which devices are compatible. I wanted to build something that helps people check compatibility before spending money on hardware.

The app uses a catalogue of devices and a rule-based system to check combinations. If it doesn't have enough information about a combination, it tells the user instead of making assumptions.

## What can it do

- Check laptop and docking-station combinations.
- Use stored compatibility information to evaluate devices.
- Show clear results so users can understand what the app found.
- Handle unknown combinations cautiously instead of giving misleading answers.

I'm continuing to improve the project and explore ways to make the experience more useful.

## Built with

- React
- TypeScript
- Vite
- CSS

## Running it locally

You'll need Node.js and npm installed on your computer.

1. Clone the repository
bash
git clone https://github.com/Anishka2007beCse25/FitsRight.git

2. Open the project folder
bash
cd FitsRight

3. Install the dependencies
bash
npm install

4. Start the app
bash
npm run dev

Open the local URL shown in your terminal to see FitsRight in your browser.

To check the production build, run:

bash
npm run build

## A look at the project

Most of the compatibility logic lives in `src/engine/`. This folder contains the device catalogue, the rules used to evaluate compatibility, and the types used by the application.

The main interface is in `src/App.tsx`, with its styling in the CSS files.

## What's next?

Some things I'd like to work on next:

- Adding more laptops and docking stations to the catalogue.
- Making compatibility results easier to understand.
- Improving the overall user experience.
- Exploring assistant-based ways to help users with compatibility questions.

## A quick note about compatibility

The results depend on the information currently available in FitsRight. If a device combination hasn't been verified, the app shouldn't be treated as proof that it will or won't work. It's always a good idea to confirm compatibility with the manufacturer before buying.

## License

This project is intended to be released under the MIT License. See the `LICENSE` file for details.