class FormTemplateController < ApplicationController
    respond_to :json

    def request_template
        @form = FormTemplate.find(params[:id])

        render json: { form_data: @form }
    end 

    def create
        @form = FormTemplate.new(form_params)

        if @form.save
            render json: { success_msg: 'Your form got created !', form_data: @form }
        else
            render json: { failure_msg: 'Some thing went wrong !' }
        end
    end

    def edit
        @form = FormTemplate.find(params[:id])

        render json: @form
    end

    def update
        @form = FormTemplate.find(params[:id])

        if @form.update(form_params)
            render json: { success_msg: 'Your form got updated !', form_data: @form }
        else
            render json: { failure_msg: 'Some thing went wrong !' }
        end
    end

    def destroy
        @form = FormTemplate.find(params[:id])
        @form.destroy

        render json: { success_msg: 'Your form succesfully got deleted !' }
    end

    private
        def form_params
          params.require(:form_template).permit(:name, :content)
        end
end
