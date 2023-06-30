Some thoughts related to refactoring:

My main game screen consists of several sections:
 *  Canvas scaled to fit in window
 *  Store at the top with K defenders for sale
 *  An information panel drawn to the right of the store
 *  A map N rows with M columns
 *  Defense area to the left of the left-most column of the map
 *  Rally area to the right of the right-most column of the map (off-screen)
 *  An overlay layer that is drawn last to make sure key info is visible

The main game components are:
 *  Collectibles that fall and provide money to buy defenders
 *  Attackers who approach from right, stack up, and hit defenders
 *  Defenders who don't move, and fire projectiles at some rate toward attackers
 *  Projectiles that move left to right until they hit or leave the screen
 *  Effect to be drawn during hits or deaths, etc (not implemented yet)

What state is shared between attackers/defenders:
 *  Assosciated config info
     *  Name
     *  Uid?
     *  Cost
     *  Img
 *  Img
 *  Health (HP)
 *  Row + Col
 *  Xpos + Ypos
 *  Width + Height

What state is specific to Attacker:
 *  Speed
 *  Effect maybe?

What state is specific to Defender:
 *  Projectile img, damage (HP)
 *  Projectile speed
 *  Projectile recharge time

What behaviors are shared:
 *  _nextTo: Given an item and a curated array of items in the same row,
    determine which item is within a distance from it
 *  hit: Given 

I currently have some global consts that are used to draw and size things. They
can be split into:

* Canvas consts
* Store consts
* Map consts
* Overlay consts

