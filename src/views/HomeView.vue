<template>
	<div>
		<div class="flex justify-start mb-4">
			<Button
				label="Novo"
				@click="abrirDialogNovo"
			/>
		</div>
		<DataTable
			selectionMode="single"
			v-model:selection="chamadoSelecionado"
			dataKey="id"
			:value="listaDeChamados"
			:rows="15"
			:rowsPerPageOptions="[5, 10, 20, 50]"
			tableStyle="min-width: 50rem"
			paginator
		>
			<Column
				field="nomeUsuario"
				header="Solicitante"
				style="width: 20%"
			/>
			<Column
				field="usuario"
				header="Nome de usuário"
				style="width: 20%"
			/>
			<Column
				field="dataPedido"
				header="Data da solicitação"
				style="width: 20%"
			/>
			<Column
				field="categoria"
				header="Categoria"
				style="width: 20%"
			/>
			<Column
				field="descricao"
				header="Descrição"
				style="width: 20%"
			>
				<template #body="slotProps">
					{{ slotProps.data.descricao.substring(0, 50)
					}}{{ slotProps.data.descricao.length > 50 ? "..." : "" }}
				</template>
			</Column>
			<Column
				header="Ações"
				style="width: 10%"
			>
				<template #body="slotProps">
					<Button
						icon="pi pi-trash"
						class="p-button-rounded p-button-danger p-button-text"
						@click="confirmarExclusao(slotProps.data)"
					/>
				</template>
			</Column>
		</DataTable>

		<ChamadoDialog
			v-model:visivel="dialogVisivel"
			:chamado="chamadoParaEditar"
			:categorias="categoriasParaSelect"
			@salvar="salvarChamado"
			@update:visivel="dialogVisivel = $event"
		/>

		<ConfirmacaoDialog
			v-model:visivel="dialogConfirmacaoVisivel"
			mensagem="Tem certeza de que deseja remover este chamado?"
			@confirmar="excluirChamado"
			@update:visivel="dialogConfirmacaoVisivel = $event"
		/>
	</div>
</template>

<script setup>
	import DataTable from "primevue/datatable"
	import Column from "primevue/column"
	import Button from "primevue/button"
	import ChamadoDialog from "@/components/ChamadoDialog.vue"
	import ConfirmacaoDialog from "@/components/ConfirmacaoDialog.vue"
	import chamadoService from "@/common/services/chamadoService"
	import { ref, onMounted, watch, computed } from "vue"

	const listaDeChamados = ref([])
	const chamadoSelecionado = ref(null)
	const dialogVisivel = ref(false)
	const chamadoParaEditar = ref({})
	const dialogConfirmacaoVisivel = ref(false)
	const chamadoParaExcluir = ref(null)

	const categoriasParaSelect = computed(() => {
		const categorias = _obterCategoriasDeChamado()
		return Object.keys(categorias).map((key) => ({
			label: categorias[key],
			value: categorias[key]
		}))
	})

	watch(chamadoSelecionado, (novoValor) => {
		if (novoValor && novoValor.id) {
			chamadoService
				.obterPorId(novoValor.id)
				.then((dados) => {
					chamadoParaEditar.value = dados
					dialogVisivel.value = true
				})
				.catch((erro) =>
					console.error(`Erro ao obter chamado com ID ${novoValor.id}:`, erro)
				)
		}
	})

	watch(dialogVisivel, (novoValor) => {
		if (!novoValor) {
			chamadoSelecionado.value = null
		}
	})

	onMounted(() => {
		_obterTodosOsChamados()
	})

	const _obterTodosOsChamados = () => {
		chamadoService
			.obterTodos()
			.then((dados) => {
				_adicionarCategoriaAosChamados(dados)
				_formatarDataChamados(dados)
				listaDeChamados.value = dados
			})
			.catch((erro) => console.error("Erro ao obter chamados:", erro))
	}

	const _obterCategoriasDeChamado = () => {
		return {
			1: "Infra",
			2: "SAP",
			3: "SalesForce",
			4: "Desenvolvimento",
			5: "Outros"
		}
	}

	const _adicionarCategoriaAosChamados = (chamados) => {
		const categorias = _obterCategoriasDeChamado()
		chamados.forEach((chamado) => {
			const categoriaId = Math.floor(Math.random() * 5) + 1
			chamado.categoria = categorias[categoriaId]
		})
	}

	const _formatarDataChamados = (chamados) => {
		chamados.forEach((chamado) => {
			const data = new Date(chamado.dataPedido)
			chamado.dataPedido = data.toLocaleDateString("pt-BR", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			})
		})
	}

	const abrirDialogNovo = () => {
		chamadoParaEditar.value = {}
		dialogVisivel.value = true
	}

	const _montarObjetoChamado = (chamadoEditado, ehEdicao = false) => {
		return {
			nomeUsuario: chamadoEditado.nomeUsuario,
			usuario: chamadoEditado.usuario,
			descricao: chamadoEditado.descricao,
			dataPedido: ehEdicao ? chamadoEditado.dataPedido : new Date().toISOString()
		}
	}

	const _criarChamado = (chamadoEditado) => {
		const objetoParaCriar = _montarObjetoChamado(chamadoEditado)

		chamadoService
			.criar(objetoParaCriar)
			.then(() => _obterTodosOsChamados())
			.catch((erro) => console.error("Erro ao criar chamado:", erro))
			.finally(() => {
				dialogVisivel.value = false
				chamadoSelecionado.value = null
			})
	}

	const _atualizarChamado = (chamadoEditado) => {
		const objetoParaAtualizar = _montarObjetoChamado(chamadoEditado, true)

		chamadoService
			.atualizar(chamadoEditado.id, objetoParaAtualizar)
			.then(() => _obterTodosOsChamados())
			.catch((erro) => console.error("Erro ao atualizar chamado:", erro))
			.finally(() => {
				dialogVisivel.value = false
				chamadoSelecionado.value = null
			})
	}

	const salvarChamado = (chamadoEditado) => {
		if (chamadoEditado.id) return _atualizarChamado(chamadoEditado)

		_criarChamado(chamadoEditado)
	}

	const confirmarExclusao = (chamado) => {
		chamadoParaExcluir.value = chamado
		dialogConfirmacaoVisivel.value = true
	}

	const excluirChamado = () => {
		if (chamadoParaExcluir.value && chamadoParaExcluir.value.id) {
			chamadoService
				.excluir(chamadoParaExcluir.value.id)
				.then(() => {
					_obterTodosOsChamados()
					chamadoParaExcluir.value = null
				})
				.catch((erro) => console.error("Erro ao excluir chamado:", erro))
		}
	}
</script>
