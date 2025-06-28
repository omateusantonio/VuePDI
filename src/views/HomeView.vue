<template>
	<div class="">
		<DataTable
			:value="customers"
			paginator
			:rows="5"
			:rowsPerPageOptions="[5, 10, 20, 50]"
			tableStyle="min-width: 50rem"
		>
			<Column field="name" header="Name" style="width: 25%"></Column>
			<Column field="country.name" header="Country" style="width: 25%"></Column>
			<Column field="company" header="Company" style="width: 25%"></Column>
			<Column field="representative.name" header="Representative" style="width: 25%"></Column>
		</DataTable>
	</div>
</template>

<script setup>
	import DataTable from "primevue/datatable"
	import Column from "primevue/column"
	import chamadoService from "@/common/services/chamadoService"
	import { ref, onMounted } from "vue"

	const listaDeChamados = ref([])

	onMounted(() => {
		_obterTodosOsChamados()
	})

	const _obterTodosOsChamados = () => {
		chamadoService
			.obterTodos()
			.then((dados) => {
				console.log("Chamados obtidos:", dados)
				listaDeChamados.value = dados
			})
			.catch((erro) => console.error("Erro ao obter chamados:", erro))
	}

	// const _adicionarCategoriaAosChamados = (chamados) => {}
</script>
