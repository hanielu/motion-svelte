<script lang="ts">
	import "@unocss/reset/tailwind.css";
	import { motion, createLayoutMotion, AnimatePresence, type Transition } from "motion-sv";
	import DiscordIcon from "~icons/ic/outline-discord";
	import LinkIcon from "~icons/stash/link-light";
	import XIcon from "~icons/system-uicons/cross";
	import TrashIcon from "~icons/mage/trash-2";

	const layout = createLayoutMotion();
	const spring: Transition = {
		type: "spring",
		stiffness: 250,
		damping: 20,
	};

	type Mode = "default" | "horizontal" | "small";
	let mode: Mode = $state("default");

	let showActions = $state(true);
	let showLink = $state(false);

	const switchMode = (m: Mode) => () => {
		layout.update();
		mode = m;
		timeoutMs = 500;
	};

	let timeoutId: number;
	let timeoutMs: number;

	function handleMouseEnter() {
		if (timeoutId) clearTimeout(timeoutId);
		showActions = true;
		// timeoutMs = undefined!; // idk If I want this
	}

	function hideActions() {
		showActions = false;
		showLink = false;
		timeoutMs = undefined!;
	}
	function handleMouseLeave() {
		// return;
		if (timeoutMs) timeoutId = setTimeout(hideActions, timeoutMs);
		else hideActions();
	}
</script>

<div class="s-screen bg-#EFF1F5 text-neutral-950 flex-s-center">
	<!-- Card -->
	<layout.div
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		animate={{ y: showActions ? -20 : 0 }}
		transition={spring}
		class="relative"
	>
		<!-- Top Actions -->
		<div class="abs top-0 inset-x-0">
			<AnimatePresence>
				{#if showActions}
					<!-- Link Section -->
					<layout.div
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.5, opacity: 0 }}
						transition={spring}
						class="abs left-0 z-10"
					>
						<motion.button
							initial={{ x: 0 }}
							animate={{ x: "-100%" }}
							exit={{ x: 0 }}
							whilePress={{ scale: 0.5 }}
							onclick={() => (showLink = !showLink)}
							class="relative text-(3xl neutral-7) bg-white rd-full p-2 shadow-lg will-change-transform"
						>
							{#if showLink}
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
									<XIcon />
								</motion.div>
							{:else}
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
									<LinkIcon />
								</motion.div>
							{/if}
						</motion.button>

						{#if showLink}
							<motion.div
								initial={{ scale: 0, y: 0, x: -50, opacity: 0 }}
								animate={{ scale: 1, y: "120%", opacity: 1 }}
								exit={{ scale: 0, y: 0, opacity: 0 }}
								transition={{
									type: "spring",
									stiffness: 400,
									damping: 30,
								}}
								class="flex-s-start gap-1 abs top-0 bg-white p-2 pr-18 rd-full origin-left shadow-lg text-neutral-4"
							>
								<LinkIcon class="text-3xl" />
								<p class="text-xl">example.com</p>
							</motion.div>
						{/if}
					</layout.div>

					<!-- Trash Button -->
					<layout.div
						transition={spring}
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						class="abs right-0 z-10"
					>
						<motion.button
							initial={{ x: 0, y: 0 }}
							animate={{ x: "55%", y: "-50%" }}
							exit={{ x: 0, y: 0 }}
							whilePress={{ scale: 0.5 }}
							class="relative text-(2xl red-7) bg-white rd-full p-3 shadow-lg"
						>
							<TrashIcon />
						</motion.button>
					</layout.div>
				{/if}
			</AnimatePresence>
		</div>

		<div class="bg-white rd-3xl grow-1 flex|col p-1 max-w-400px min-w-200px max-h-420px overflow-hidden">
			<!-- Card Header -->
			<layout.div transition={spring} class="p-5 flex-s-start gap-2">
				<layout.div transition={spring} class="shrink-0 s-60px bg-#6370F1 flex-s-center rd-full">
					<DiscordIcon class="text-(30px white)" />
				</layout.div>

				<AnimatePresence mode="popLayout">
					{#if mode !== "small"}
						<layout.div
							transition={spring}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { duration: 0.3 } }}
							exit={{ opacity: 0 }}
							class="flex-s-between gap-15 grow-1 will-change-transform"
						>
							<div>
								<p class="fw-semibold text-xl">Quillow</p>
								<p class="op-90">100+ members</p>
							</div>
							<div class="shrink-0">
								<button class="flex-s-center gap-3 shadow-sm text-lg b-2 px-4 py-2 rd-full">
									<DiscordIcon class="text-(#6370F1)" />
									<span>Join</span>
								</button>
							</div>
						</layout.div>
					{:else}
						<layout.div transition={spring} class="ml-a s-40px b flex-s-center rd-full">
							<DiscordIcon class="text-(xl #6370F1)" />
						</layout.div>
					{/if}
				</AnimatePresence>
			</layout.div>

			<!-- Card Body -->
			<layout.div
				transition={spring}
				class={["rd-3xl grow-1 py px overflow-y-auto relative", mode === "small" ? "" : "bg-#EFF1F5"]}
			>
				<AnimatePresence mode="popLayout" initial={false}>
					{#if mode !== "small"}
						<!-- Avatar Wrapper container -->
						<motion.div
							layout
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0, filter: "blur(4px)" }}
							transition={spring}
							class={mode === "default" ? "flex|col gap-2" : "flex"}
						>
							{#each { length: 6 }, i (i)}
								<!-- Avatar Wrapper item -->
								<layout.div transition={spring} layoutId="wrapper-{i}" class="flex gap-3">
									<layout.div layoutId="avatar-{i}" class="bg-pink s-50px rd-full relative">
										<div class="abs bg-#EFF1F5 bottom-0 right-0 rd-full p-1">
											<div class="s-10px bg-green rd-full"></div>
										</div>
									</layout.div>
									<div class="relative">
										<AnimatePresence mode="popLayout" initial={false}>
											{#if mode == "default"}
												<layout.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
													<p>Sam</p>
													<p>Online</p>
												</layout.div>
											{/if}
										</AnimatePresence>
									</div>
								</layout.div>
							{/each}
						</motion.div>
					{:else}
						<layout.div transition={spring} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
							<p class="fw-semibold text-xl">Quillow</p>
							<p class="op-90">100+ members</p>
						</layout.div>
					{/if}
				</AnimatePresence>
			</layout.div>

			<!-- Actions -->
			<AnimatePresence>
				{#if showActions}
					<div class="abs bottom-0 inset-x-0 translate-y-50% flex-s-center will-change-transform">
						<layout.div
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.5, opacity: 0 }}
							transition={spring}
							class="bg-white px-5 py-4 will-change-transform relative shadow-lg rd-full flex-s-center gap-6"
						>
							<motion.button
								class="s-30px b-2 b-neutral-6 rd-4px"
								animate={{
									backgroundColor: mode == "default" ? "rgba(82, 82, 82, 1)" : "rgba(82, 82, 82, 0)",
								}}
								onclick={switchMode("default")}
							/>
							<motion.button
								class="w-35px h-18px b-2 b-neutral-6 rd-4px"
								animate={{
									backgroundColor: mode == "horizontal" ? "rgba(82, 82, 82, 1)" : "rgba(82, 82, 82, 0)",
								}}
								onclick={switchMode("horizontal")}
							/>
							<motion.button
								class="s-22px b-2 b-neutral-6 rd-4px"
								animate={{
									backgroundColor: mode == "small" ? "rgba(82, 82, 82, 1)" : "rgba(82, 82, 82, 0)",
								}}
								onclick={switchMode("small")}
							/>
						</layout.div>
					</div>
				{/if}
			</AnimatePresence>
		</div>
	</layout.div>
</div>
