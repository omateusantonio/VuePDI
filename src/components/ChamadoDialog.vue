<template>
	<Dialog
		v-model:visible="dialogVisivel"
		:style="{ width: '450px' }"
		header="Detalhes do Chamado"
		:modal="true"
		@hide="fecharDialog"
	>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<label>Nome do Solicitante:</label>
				<InputText v-model.trim="chamadoEditado.nomeUsuario" required="true" />
			</div>

			<div class="flex flex-col gap-2">
				<label for="usuario">Usuário:</label>
				<InputText v-model.trim="chamadoEditado.usuario" required="true" />
			</div>

			<div class="flex flex-col gap-2">
				<label>Categoria:</label>
				<Dropdown
					v-model="chamadoEditado.categoria"
					:options="categorias"
					optionLabel="label"
					optionValue="value"
					placeholder="Selecione uma categoria"
				></Dropdown>
			</div>

			<div class="flex flex-col gap-2">
				<label>Descrição:</label>
				<TextArea
					v-model="chamadoEditado.descricao"
					required="true"
					rows="3"
					cols="20"
					:maxlength="250"
				/>
			</div>
		</div>

		<template #footer>
			<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="fecharDialog" />
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
	import { ref, watch, defineProps, defineEmits } from "vue"
	import Dialog from "primevue/dialog"
	import InputText from "primevue/inputtext"
	import TextArea from "primevue/textarea"
	import Dropdown from "primevue/dropdown"
	import Button from "primevue/button"

	const props = defineProps({
		visivel: Boolean,
		chamado: Object,
		categorias: Array
	})

	const emits = defineEmits(["update:visivel", "salvar"])

	const dialogVisivel = ref(props.visivel)
	const chamadoEditado = ref({})

	watch(
		() => props.visivel,
		(novoValor) => {
			dialogVisivel.value = novoValor
			if (novoValor) {
				chamadoEditado.value = { ...props.chamado }
			} else {
				chamadoEditado.value = {}
			}
		}
	)

	const fecharDialog = () => {
		emits("update:visivel", false)
	}

	const salvarChamado = () => {
		emits("salvar", chamadoEditado.value)
		fecharDialog()
	}
</script>
