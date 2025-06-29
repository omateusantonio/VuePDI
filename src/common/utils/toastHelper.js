let toastInstance = null

export function setToastInstance(instance) {
	toastInstance = instance
}

export function sucesso(mensagem) {
	toastInstance?.add({
		severity: "success",
		detail: mensagem,
		life: 6000,
		position: "top-center"
	})
}

export function erro(mensagem) {
	toastInstance?.add({
		severity: "error",
		detail: mensagem,
		life: 6000,
		position: "top-center"
	})
}

export function atencao(mensagem) {
	toastInstance?.add({
		severity: "warn",
		detail: mensagem,
		life: 6000,
		position: "top-center"
	})
}

export function erroApi(error) {
	if (error?.response?.data?.notificacoes?.length > 0) {
		error.response.data.notificacoes.forEach((erro) => {
			toastInstance?.add({
				severity: "error",
				detail: erro.message,
				life: 6000,
				position: "top-center"
			})
		})
	} else if (error?.message?.length > 0) {
		toastInstance?.add({
			severity: "error",
			detail: error.message,
			life: 6000,
			position: "top-center"
		})
	} else {
		toastInstance?.add({
			severity: "error",
			detail: "Erro ao conectar com a API.",
			life: 6000,
			position: "top-center"
		})
	}
}
