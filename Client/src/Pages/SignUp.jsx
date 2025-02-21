import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../Features/Auth/AuthSlice';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();
    useEffect(() => {
        if (user) {
            navigate("/home/chat")
        }
    }, [user])

    const onSubmit = (data) => {
        dispatch(signupUser(data));
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">SignUp</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            type="text"
                            id="name"
                            className={`mt-1 block w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            id="email"
                            className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            {...register('password', { required: 'Password is required' })}
                            type="password"
                            id="password"
                            className={`mt-1 block w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'SignUp'}
                        </button>
                    </div>
                </form>

                {error && (
                    <p className="text-red-500 text-center mt-4">{error}</p>
                )}


            </div>
        </div>
    );
}

export default SignUp;
