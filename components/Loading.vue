<template>
    <div class="loader-container">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader-2 animated" width="44"
            height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round"
            stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 3a9 9 0 1 0 9 9" :style="{
                animation: `spin 2s linear infinite`
            }" />
        </svg>
    </div>
</template>

<script setup>
</script>

<style scoped>
.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.animated {
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>