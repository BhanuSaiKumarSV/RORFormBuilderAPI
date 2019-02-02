Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post '/forms/create', to: 'form_template#create'
  get '/forms/edit/:id', to: 'form_template#edit'
  put '/forms/update/:id', to: 'form_template#update' 
  get '/forms/:id', to: 'form_template#request_template'
  delete '/forms/:id', to: 'form_template#destroy'
end
