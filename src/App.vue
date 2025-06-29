<script setup>
	import { useToast } from "primevue/usetoast"
	import { setToastInstance } from "@/common/utils/toastHelper"

	const toast = useToast()
	setToastInstance(toast)
</script>

<template>
	<Toast />
	<router-view />
</template>
