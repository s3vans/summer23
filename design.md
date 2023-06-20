# Summer 2023 Game Dev

## Goals

Shayne wants a customizable "plants vs. zombies" style game.

Kieran wants to customize it with a Pokemon theme.  

Finn wants to customize it with an Among Us theme.

## Road to MVP

1. Display a rudimentary background in the standard resolution.
   600x800, 6 rows of 100px, with 5 rows used for attacks.
2. Display a rudimentary defender in the purchase menu.
3. Allow the user to select and place a defender in the grid.
4. Add scaling up and down to maximize use of window size.
5. Dispatch a rudimentary attacker at some interval.

## Key Features

A **level** consists of:
  * A timer
  * A background image
  * A background music track
  * A starting amount of XP used by the player to purchase defenders
  * A set of defenders
  * A set of attackers
  * A distribution or timing sequence for attackers to arrive
  * A menu to purchase and place defenders
  * A frequency of XP rewards that drop
  * A timed sequence of events, such as announcing the next wave

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

   