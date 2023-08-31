# Summer 2023 Game Dev

## Goals

Shayne wants a customizable "plants vs. zombies" style game.

Kieran wants to customize it with a Pokemon theme.  

Finn wants to customize it with an Among Us theme.

## Update as of August 31, 2023

All of the major features are complete, if not hacked together.  Kieran
designed the levels, but it hasn't been play-tested and they probably need
quite a bit of tweaking to make them consistently fun to play through, but
overall it was a fun project and we accomplished a lot.

I'm really proud of Kieran's art work, his vision and ideas for game features
(many of which were more clever than my ability to implement them), his ability
to beta test and identify bugs, and his ability to comment on the code and spot
some mistakes as I was making them or before I could.

We didn't get to make version for Finn's game as planned, but in theory we
could support an entirely different game with just config changes if Finn makes
the level and character art and sounds.

We'll see what other bugs crop up, but given that this is our second attempt to
make this game and we actually built all the pieces, I'm excited to see how
much we can improve on it in future iterations.


## Update as of July 7, 2023

The MVP feature are arguably done but in a very rudimentary way.  I took a lot
of shortcuts and the code needs refactoring and clean up.

Now that I have a vision for what the config looks like, I would like to move
to a model where config will be implicit in most cases, derived from the
existance of specific files, but overrides can be added if needed.

Two big missing pieces are:

1. The timing of events is frame-dependent.
2. I haven't added any sounds yet.

There are also some ugly hacks that I'd like to clean up:

1. Attackers and defenders don't manage their own drawing logic.
2. The animation code uses a hard-coded frame rate.

There are some things I'm currenty wondering about:

* Is there a better way to distinguish between type config (like the name and
  size of a defender) and instance config (like it's current position on the
  map)?

## Road to MVP

1. Display a rudimentary background in the standard resolution.
   600x800, 6 rows of 100px, with 5 rows used for attacks.
2. Display a rudimentary defender in the purchase menu.
3. Allow the user to select and place a defender in the grid.
4. Add scaling up and down to maximize use of window size.
5. Dispatch a rudimentary attacker at some interval.

## Key Features

A **level** consists of:
  * ~~A timer~~ (there is an in-game elapsed timer, but it's not displayed)
  * ~~A background image~~
  * ~~A background music track~~
  * ~~A starting amount of XP used by the player to purchase defenders~~
  * ~~A set of defenders~~
  * ~~A set of attackers~~
  * ~~A distribution or timing sequence for attackers to arrive~~
  * ~~A menu to purchase and place defenders~~
  * ~~A frequency of XP rewards that drop~~ (Collectibles)
  * ~~A timed sequence of events, such as announcing the next wave~~

The **layout** of a level incudes:
  * A dedicated area to display game info, such as:
      * XP collected
      * Time elapsed / level-progress
  * A dedicated area to display the available defenders for purchase
  * The main area with:
      * A defensive position on the left -- if enemies enter, they win
      * Rows to be defended from attackers approaching from the right
      * A grid of spots in which defenders can be placed

Character details:
  * Each defender has:
      * XP cost
      * HP health
      * A speed or cadance for defensive attacks
      * Attack strenghs and defensive weaknesses
      * Animations for idle, attacking, taking damage, dying
      * Most defenders launch projectile attacks
  * Each attacker has:
      * HP health
      * Attack strengths and defensive weaknesses
      * A speed or cadence for moving + attacks
      * Animations for walking, idle attacking, taking damage, dying
      * Most attackers attack when they are next to the defender

Graphics considerations:
  * Fixed resolution, but it can be scaled up or down to fit in
    the available window size
  * Fixed size rows and grid spaces dictate character size
  * Fixed size purchase menu grids dictate shopping display
  * Overlayed animations and sounds may be played for effect
  * The background remains behind everything
  * Characters added later should appear in front of earlier
  * Projectiles should appear in front of characters
  * Overlayed animations appear in front of everything, except..
  * The game screen can be suspended and a menu screen overlayed

Interaction considerations:
  * The user can click to select a defender then click to place in an available
    grid slot
  * The user can click on rewards as they fall or when they have landed to
    collect XP, but only on the non-transparent pixels
  * In rare cases, the user can click on a defender to launch a special attack
  * The main game can be suspended for other menu screens or cut scenes

