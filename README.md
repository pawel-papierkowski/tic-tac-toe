# tic-tac-toe

Very simple project showing off the very basics of Vue frontend project.
URL: https://pawel-papierkowski.github.io/tic-tac-toe/

## Play where you can win on impossible difficulty
Human starts first.
X: 0,0
O: 1,1
X: 2,2 (O can still recover if it puts on sides, not corners, since it will force X to put )

Reason: lack of detection of fork for opponent?
ISSUE: you need to make move in different cell than where opponent's fork could happen.

What to do? Likely we need to rewrite this piece of code. Ughhhh.

## TODO
- these damn forks...
- review of codebase