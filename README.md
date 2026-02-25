# Tic-Tac-Toe

Very simple project showing off the very basics of Vue frontend project. Basically step up from Hello World.
URL of deployed app: https://pawel-papierkowski.github.io/tic-tac-toe/

This is fully functional Tic-Tac-Toe game, including AI difficulty for perfect play.

## Used

Node.js: 24.13.0
Vue.js: 3.5.27

## Bugs

- On Firefox, sometimes there is delay in showing images of crosses/naughts when they should be shown for first time. Subsequent use works fine.
  Issue is fixed by inserting preloaded images in index.html:
  <link rel="preload" href="/cell_2.svg" as="image" type="image/svg+xml">
  It works, but for some reason Firefox sends warnings about not used assets on console. Hopefully, changing preload to prefetch solves log pollution while still removing delay.
  Issue does not seem to happen on Chrome.
