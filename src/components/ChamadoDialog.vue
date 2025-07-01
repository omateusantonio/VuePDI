<template>
	<Dialog
		v-model:visible="dialogVisivel"
		:style="{ width: '450px' }"
		header="Detalhes do chamado"
		:modal="true"
		@hide="fecharDialog"
	>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<label>Nome do solicitante:</label>
				<InputText
					v-model.trim="chamadoEditado.nomeUsuario"
					required="true"
					:class="{ 'p-invalid': erros.nomeUsuario }"
				/>
				<Message
					v-if="erros.nomeUsuario"
					severity="error"
					:closable="false"
				>
					O nome do solicitante é obrigatório
				</Message>
			</div>

			<div class="flex flex-col gap-2">
				<label>Usuário:</label>
				<InputText
					v-model.trim="chamadoEditado.usuario"
					required="true"
					:class="{ 'p-invalid': erros.usuario }"
				/>
				<Message
					v-if="erros.usuario"
					severity="error"
					:closable="false"
				>
					O usuário é obrigatório
				</Message>
			</div>

			<div class="flex flex-col gap-2">
				<label>Categoria:</label>
				<Select
					v-model="chamadoEditado.categoria"
					:options="categorias"
					optionLabel="label"
					optionValue="value"
					placeholder="Selecione uma categoria"
					:class="{ 'p-invalid': erros.categoria }"
				/>
				<Message
					v-if="erros.categoria"
					severity="error"
					:closable="false"
				>
					A categoria é obrigatória
				</Message>
			</div>

			<div class="flex flex-col gap-2">
				<label>Descrição:</label>
				<TextArea
					v-model="chamadoEditado.descricao"
					required="true"
					rows="3"
					cols="20"
					:maxlength="250"
					:class="{ 'p-invalid': erros.descricao }"
				/>
				<Message
					v-if="erros.descricao"
					severity="error"
					:closable="false"
				>
					A descrição é obrigatória
				</Message>
			</div>
		</div>

		<template #footer>
			<Button
				label="Fechar"
				icon="pi pi-times"
				class="p-button-text"
				@click="fecharDialog"
			/>
			<Button
				:label="chamadoEditado.id ? 'Atualizar' : 'Salvar'"
				icon="pi pi-check"
				class="p-button-text"
				@click="salvarChamado"
			/>
		</template>
	</Dialog>
</template>

<script setup>
	import { ref, watch } from "vue"
	import Dialog from "primevue/dialog"
	import InputText from "primevue/inputtext"
	import TextArea from "primevue/textarea"
	import Select from "primevue/select"
	import Button from "primevue/button"
	import Message from "primevue/message"

	const props = defineProps({
		visivel: Boolean,
		chamado: Object,
		categorias: Array
	})

	const emits = defineEmits(["update:visivel", "salvar"])

	const dialogVisivel = ref(props.visivel)
	const chamadoEditado = ref({})
	const erros = ref({})

	const limparErros = () => {
		erros.value = {}
	}

	const limparChamado = () => {
		chamadoEditado.value = {}
	}

	const inicializarChamado = () => {
		chamadoEditado.value = { ...props.chamado }
		limparErros()
	}

	const resetarFormulario = () => {
		limparChamado()
		limparErros()
	}

	const validarCampos = () => {
		limparErros()

		if (!chamadoEditado.value.nomeUsuario || chamadoEditado.value.nomeUsuario.trim() === "") {
			erros.value.nomeUsuario = true
		}

		if (!chamadoEditado.value.usuario || chamadoEditado.value.usuario.trim() === "") {
			erros.value.usuario = true
		}

		if (!chamadoEditado.value.categoria) {
			erros.value.categoria = true
		}

		if (!chamadoEditado.value.descricao || chamadoEditado.value.descricao.trim() === "") {
			erros.value.descricao = true
		}

		return Object.keys(erros.value).length === 0
	}

	watch(
		() => props.visivel,
		(novoValor) => {
			dialogVisivel.value = novoValor
			novoValor ? inicializarChamado() : resetarFormulario()
		}
	)

	const fecharDialog = () => {
		emits("update:visivel", false)
		resetarFormulario()
	}

	const salvarChamado = () => {
		if (!validarCampos()) return

		emits("salvar", chamadoEditado.value)
		fecharDialog()
	}
</script>
