# Tic-Tac-Toe

Very simple project showing off the very basics of Vue frontend project. Basically step up from Hello World.
URL of deployed app: https://pawel-papierkowski.github.io/tic-tac-toe/

This is fully functional Tic-Tac-Toe game, including AI difficulty for perfect play.

## Used

Node.js: 24.13.0
Vue.js: 3.5.27

## Bugs

- On Firefox, sometimes there is delay in showing crosses/naughts images for unknown reason.
  Used measure (preloading images in index.html and in App.vue) maybe worked?
  Hard to test as it is unreliable, but using fetch() looks better. Issue is that now
  Issue does not seem to happen on Chrome.
