<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Socialite;  
use App\User;
use Auth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/map';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

        /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }
    
    /**
     * Obtain the user information from GitHub.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleProviderCallback($provider)
    {
        $user = Socialite::driver($provider)->user();
        return $this->login($user);
    }
    /**
     * @param  $user Socialite user object
     * @return  Redirect
     */
    public function login($user)
    {
        $authUser = User::where('provider_id', $user->id)->first();
        if ($authUser) {
            Auth::login($authUser, true);
            return redirect($this->redirectTo);
        }

        $authUser = User::create([
            'nickname' => $user->nickname ? $user->nickname : $user->name,
            'avatar' => $user->avatar,
            'provider' => request()->route('provider'),
            'provider_id' => $user->id,
        ]);
        Auth::login($authUser, true);
        return redirect($this->redirectTo);        
    }
}
