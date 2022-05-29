
                                                     # BattlePoc
                                                Game Concours Babylonjs


Créateurs:
Matthis Kuhl, Ahmed El Hanafi Si Dehbi


![Screenshot](readmeimage/menu.png)

Concept de jeu:

Le jeu s'inspire du monde pokemon, il est mode un joueuer et vous étez pikatchu.
Vous devez vous battre contre les autres pokemons et sur tous contre le redutable pokemon boss Mewtwo.
La map est générer aléatoirement avec un algorithme reliant les salles positioner au hasard avec des chemins.
Il y a plusieurs enemie qu'on peut retrouver dans les salles.
Les salles ce recharge à chaque fois que vous y entrer de dans.
Vous gagnez des experiance et donc des niveaux pour chaque victoir sur un pokemon.
De plus la difficulté des salles augemante avec le gain de niveau.

L'histoire:

Nous jouant dans un monde ou Miewtwoo à décidé de faire disparaitre tous les humain sur terre et de les éffacés de la mémoires des pokemons. Picatchu est le dernier à avoir des souvenirs et ce met à la concete pour le retour des Humains.
Bien que les autres pokemons et leurs environement vont rendre cette conquete difficile arrivera-t-il à c'est fin?
C'est à vous de sauver ce monde.

Réggle de jeut:
Il ne faut pas résté dans l'eau si non on perdra vite connaisance.
Le but est de battre les autres pokemons affin de gagner en experiance puis battre le boss mewtwo qui ce trouve à l'autre coté de la map.


Lien video d'un montage de game play du jeut :
https://youtu.be/gvQq46K9cbI

lien d'ébergement du jeu:
https://kuhlmatthis.github.io/BattlePoK/


Menu:

Le menu est une interface babylonjs scene rendered au debut on peut appuiez sur:

Play pour demare la vidéo est puis jouer par la suite
Replay pour lancé une partie sans vidéo 
Informations pour obtenir les information de jeu nécéssaire.
Quit: pour sortir du jeu.

Si on jeut est lancé à la touche p on reviens sur la scene du menu et avec play on continue le jeu, replay on lance un nouveau jeu.

Creation de la map:

On a définis en careau 50 50 qui est la map de notre jeu.
Chaque salle est un rectange fix à une position x et y de longeure 20.
Pour positioner:
tant que existe salle à placer:
On prend un point au hasard dans la map et on verrifie qu'il ne ce croise pas avec une salle déjà existant.
en fonction du résultat présenedant en rajoute la salle et en diminue les salles à creer ou si non en continue à boucler.

Pour creer les chemin on connecte salle 0 à salle 1 puis salle 1 à salle 2 etc
Pour chaque salle en à definis le point de départ et d'arriver juste devant la porte par la suite on peut calculer le mouvement nécéssaire pour le chemin: position x de la salle 1 - position x de la salle 2 et position y de la salle 2 - position y de la salle 2
On va boucler sur c'est valeur et à chaque fois creer les box à la position actuelle puis reduer les valeur.
Si les valeurs sont à 0 0 on est arrivé chez l'autre salle.

Difficulté: en peut passez à travers des salles entre le point de départ et d'arriver.
La solution n'est pas si compliqué grace à la forme d'une salle rectangulaire. Si jamais en croise une salle:
on allange sur les mures droites ou gauche j'usqu'au bout puis en avance de un.
Il faut pas oublié d'incrémenter les valeurs en fonction affin de prendre en compte qu'on reprend de la distance et revenir dans l'autre sense plus tard.

Generer aléatoirement de la map étais compliqué sur tous qu'on travaillé avec plusieurs boucle while non trivial pour positionnement les salles et creer les chemins.
Donc fallais comprendre pourquoi ca bouclé souvant à l'invinis et donc plante la page web.

Exterieure:
![Screenshot](readmeimage/exterieure.png)

Pour rendre l'exterieure plus intérrésant on a positioner des enemie au assard sur la map. Un pokemon d'eaux et un volant.
Il fallais vérifié que la création ne ce fessait pas sur le chemin en lui même risque que c'est enemi sont stocker dans les mures ou que les pokemon d'eau se trouve sur la surface.
Pour des résultats propre on as découpé la map dans des zones ou en générais un ennemi soit volant soit nagant.
Dans cette zone en choisis une position au hasard et on verifie grace à un ray cast qu'il n'y a pas de colision avec un chemin.

Deux problemes sont que dans les salles le sol n'est pas encore généré donc l'enemie peut se retrouver de dans et que juste le sol classique et verifier non le sole sous forme lave.

Il y a des particules fummés devant l'entree qui disparaise et reapparaise lors de l'entrée sortis de la salle.
Plus concrétement j'ai une box de la taile de salle avec alpha = 0 donc invisible.
Cette box a un actionmanager qui trigger lors de l'entrée ou sortis de cette box et donc va executer plusieur chose:
1: desactive ou active le systeme de particule devant l'entrée.
2: desactive ou active le systeme de particule de la plui sur picatchu
3: disable tous les enemies éxtérieure
4: genere le sol et ellement d'environnement et ennemie de la salle (suite)


Salle et Ennemi:
![Screenshot](readmeimage/fullsale.png)

La salle en elle meme est générer que à l'entreer de picatchu ce qui augemente les preformances.
Il existe trois types de salles:
Salles normale avec le double d'ennemie.
Salles avec de la lave sur le sol.
Salles avec des statues dragons crachant du feut sur une longeur.

Pour detecter la colision de picatchu avec le sol de lave à chaque frame on lance un rayon du centre de picatchu vers le sol.
Le rayon est d'une distance à juste toucher un peut le sol comme ca si on sotte par dessus pas de probleme.
Si le rayon touche un objet "lave" il prend des dégats.
L'avantage est que nous controlons la colision du coté mobil (picatchu) et non du coté du sole lave ce qui reduit fortement le nombre de vérification de colision.
Pour le feut cracher par le dragon c'est un systme de particule pour chaque careuax et une box invisible generer à chaque attaque.
Cette box est prise en compte aussi par le raycast de picatchu pour prendre des dégats.

Pour la génération des enemies une salle calcule une valeur par rapport au niveau de picatchu cette valeur est des ennemi de la salle. 
Concretement en boucle tant que valeur n'est pas égale à 0 et on génere un ennemi au hasard et à un endroit hasard dans la salle.
Chaque enemi enleve un nombre précis à cette valeur qui peut varier en fonction de ca puissance.

Il y a dans les salles 4 types d'ennemi:
Le marowak(nb: 1) attack proche l'ennemi de base
Le pappillon(nb: 2) identité volant qui lance des balles sur le picatchu (les balles on un actionmanager on intersect avec box de picatchu).
La bombe(nb: 3) lorsque cette identité est trop proche elle explose et vous donnes un packet dégats
Le cheval (nb: 4) elle courts sur vous mais remais sont mouvement et vision que certaine fois à jours emets de dégats lors de la colision avec lui.

A l'éxtérieure il existe un pokemon d'eau qui ressemble au papillon par contre ce lui si bouge completement aléatoirement sur le terrain.



Lumiere:
![Screenshot](readmeimage/fireandlight.png)
Il existe plusieur type de lumiere dans le jeut le sollei la lumiere jaune.
Une lumiere de point suivant picatchu amene effet de profendeur.
Et les lumiere dans les salles qui sont un mesh avec animation et fais avec blender et un point lumiere soit vert,bleu ou rouge.
De plus il y a un GlowLayer appliqué sur les meshes (fais briller).

Picatchu:
Pour la vision du jeut on utilise une FollowCamera celle si suit non pas picatchu mais une boit invisible paranthé à picatchu qui est on peut plus loin et plus en hauteur que picatchu.
Picatchu à des annimation il peut marché, courir, attaque, sauter, perdre.
Il a aussi des bares (rectangle couleur différant) de vie, experiance et d'energie pour les modifier j'utilise leur scaling et je les déplace un peut (1/2 vers la gauche).
De plus c'est bares sont parenthé à picatchu.
(Pour les ennemi c'est pareille).
Pour l'attque d'eclaire j'ai un objet qui a une animation d'extension fais sous blender qui appariat à chaque attaque.
Les attaques sont variers coute pas d'énérgie, font plus de dégats, sont instantané (ray casting) ou une boule ce propagant etc.
Pour la plui elle est attaché à picatchue emmet dans un rectangle autour de picatchu.
Le saut ne sont que autorisé depuis une certaine hauteur celui du sol.
Il y a beaucoup de timing pour incrementer la vie et l'energie et gerer les attacs.

Mesh et video:
![Screenshot](readmeimage/blender.png)

Pour les meshes une partie et récuperer sur internet cgtrader.com/ puis souvent repain puis skeletisé et animé en blender par nous meme.*
Puis transformer en fichier babylon.
Puis par la suite pour faire la vidéo j'ai importer tous les pokemon dans un dokument plainder j'ai creer l'ariere fon avec deux planes puis les animation par la suite j'ai render chaque scene.
Pour assemblé j'ai reimporter chaque render rajouter l'écriture et la music puis re render la video complette.
La derniere étape consisté à transformais la vidéo sous forme mp4 l'importer comme VideoTexture dans une plan de taille de l'ecran puis il fallais juste fixé la camera a la bonne position.
Lors du switch du menu à la vidéo on render la scene de la video à la fin on dispose la video et on render la scene du jeu.


Boss:


![Screenshot](readmeimage/Boss.png)

Pour aller au bosse faut monter l'arene entierement mon fais sous blender est exporté.
Probleme qu'on a eu des interface non parfaitement droite au sol pour un effet visuelle en creer des collision dérangant.
Le boss est un ennemi classique avec plus de vie et plus de comportement speciale:
Il a trois comportement:

1: Ce teleporte au hasard sur un rayon pour faire cella on calcule une val x sur le diametre puis on utilise pitagore pour trouver ca positon y sachant que le rayon est donc le coté le plus long est statique.
A chaque deuxieme téléportation balance une balle vers picatchu

2:
Ce mets or porté de picatchu est fais tombé des balles du cielle d'eau dessus de picatchu.
(Faut rester on mouvement pour les évité)

3:
Ce teleport sur un rayon plus large et on hauteur puis vole en ligne droit sur picatchu en le touchant emets des dégats plusieurs fois.

Mewtwo n'est que attacable lors de la stategie 1 et il altaire entre strategie 1 puis strategie 2 ou 3 puis restrategie 1 ...


Soucis et possible amélioration:

Les enemies à l'exterieur peuve aparaitre dans les salles et peuve bisarement resté inactif qu'elle que fois.
Donc faut verifier la manipulation des liste des ennemis active et bloqué le spon d'ennemi vers les salles.
La vision de la camera peut etre caché par les rectangle et d'autre element du jeut.
Une solution cerrais de creer on grand cube deriere la camera qui a un actionmanager et reduit l'alpha à l'entree dans ce cube et le reaugemente à la sortis des objets.
