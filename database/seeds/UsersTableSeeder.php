<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('users')->delete();
        
        \DB::table('users')->insert(array (
            0 => 
            array (
                'id' => '1',
                'nickname' => 'ajthinking',
                'avatar' => 'https://avatars0.githubusercontent.com/u/3457668?v=4',
                'provider' => 'github',
                'provider_id' => '3457668',
                'remember_token' => 'P8zIaX1XvGrXTk6A0lJhyydGm2nI1VOfxiGK76MiStyc05usmWtTOsXq67JI',
                'created_at' => '2019-03-03 01:47:06',
                'updated_at' => '2019-03-03 01:47:06',
            ),
        ));

        \DB::table('users')->insert(array (
            0 => 
            array (
                'id' => '2',
                'nickname' => 'MrDoggo',
                'avatar' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsnidYRiX6SRK6RujILBQxB43NrWlpx3xKIFWRIcMYhzuC_SLn',
                'provider' => 'github',
                'provider_id' => '3457669',
                'remember_token' => 'P8zIaX1XvGrXTk6A0lJhyydGm2nI1VOfxiGK76MiStyc05usmWtTOsXq67JX',
                'created_at' => '2019-03-03 01:47:06',
                'updated_at' => '2019-03-03 01:47:06',
            ),
        ));        
        
        
    }
}