<template>
	<Dialog
		v-model:visible="dialogVisivel"
		:style="{ width: '350px' }"
		header="Confirmar ação"
		:modal="true"
		@hide="fecharDialog"
	>
		<div class="flex items-center justify-center gap-2">
			<i
				class="pi pi-exclamation-triangle mr-3"
				style="font-size: 2rem"
			/>
			<span>{{ mensagem }}</span>
		</div>

		<template #footer>
			<Button
				label="Cancelar"
				icon="pi pi-times"
				class="p-button-text"
				@click="fecharDialog"
			/>
			<Button
				label="Confirmar"
				icon="pi pi-check"
				class="p-button-text"
				@click="confirmarAcao"
			/>
		</template>
	</Dialog>
</template>

<script setup>
	import { ref, watch, defineProps, defineEmits } from "vue"
	import Dialog from "primevue/dialog"
	import Button from "primevue/button"

	const props = defineProps({
		visivel: Boolean,
		mensagem: String
	})

	const emits = defineEmits(["update:visivel", "confirmar"])

	const dialogVisivel = ref(props.visivel)

	watch(
		() => props.visivel,
		(novoValor) => {
			dialogVisivel.value = novoValor
		}
	)

	const fecharDialog = () => {
		emits("update:visivel", false)
	}

	const confirmarAcao = () => {
		emits("confirmar")
		fecharDialog()
	}
</script>
