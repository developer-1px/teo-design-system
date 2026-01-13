import { useState } from "react";
import { Frame } from "../design-system/Frame";
// import { ProseDocument } from "../design-system/Prose";

// CMS Sections
import { BodyContentSection } from "./cms/BodyContentSection";
import { CMSSidebar } from "./cms/CMSSidebar";
import { SidebarToggle, TopCenterBar, TopRightBar } from "./cms/CMSNavigation";
import { ScrollTabSection } from "./cms/ScrollTabSection";
import { FAQBoardFooter } from "./cms/FAQBoardFooter";
import { FeatureGridSection } from "./cms/FeatureGridSection";
import { HeaderHero } from "./cms/HeaderHero";
import { ImageFooterBanner } from "./cms/ImageFooterBanner";
import { MainFooter } from "./cms/MainFooter";
import { SiteHeader } from "./cms/SiteHeader";

export function CMSApp() {
	const [isSidebarOpen, setSidebarOpen] = useState(true);

	return (
		<Frame fill surface="raised" overflow="hidden">
			<TopCenterBar />
			<TopRightBar />
			<SidebarToggle
				isOpen={isSidebarOpen}
				onClick={() => setSidebarOpen(!isSidebarOpen)}
			/>

			<Frame row fill>
				<CMSSidebar isOpen={isSidebarOpen} />
				<Frame
					flex
					fill
					surface="overlay"
					align="center"
					justify="start"
					overflow="auto"
				>
					{/* The Canvas */}
					<Frame w="100%" style={{ minHeight: "100%" }}>
						<SiteHeader />
						<ScrollTabSection />
						<HeaderHero />
						<FeatureGridSection />
						<BodyContentSection />
						<ImageFooterBanner />
						<FAQBoardFooter />
						<MainFooter />
					</Frame>
				</Frame>
			</Frame>
		</Frame>
	);
}
