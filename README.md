## TerraCraft
<img src="https://i.imgur.com/IwKcMV8.png"></img>


## Development installation
```
git clone git@github.com:ajthinking/terracraft.git
cd terracraft
cp .env.example .env
# set your database
composer install
php artisan key:generate
php artisan migrate:fresh --seed
npm install
npm run dev
valet secure # https required for gps
```

## Thesaurus
| Name        | Meaning |
| ------------- |------|
| d      | distance in meters between tile centers |
| offset      | How much to offset the center point to create the feeling of a random world. 0-1      |
| padding | ?      |
| dLng | at latitude lat, 1 meter equals dLng degrees |
| dLat | 1 meter always equals 1/111111 latitude degrees (approximately) |
| X, Y | Projected tile coordinates starting at lat,lng = 0,0 with a spacing of d meters|
| vX, vLat, ... | Virtual coordinates - after the offset this are the result the user will actually see|