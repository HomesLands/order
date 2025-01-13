import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui'
import {
  LandingPageBackground,
  LandingPageBackgroundMobile,
} from '@/assets/images'
import { useIsMobile } from '@/hooks'
import { ROUTE } from '@/constants'
import { BestSellerCarousel, StoreCarousel } from './components'
import { AdPopup } from '@/components/app/AdPopup'

export default function HomePage() {
  const isMobile = useIsMobile()

  // Animation Variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <div className="flex w-full flex-col">
      <AdPopup />
      <div className="flex flex-col gap-6">
        {/* Section 1: Hero - Full width */}
        <motion.div
          className="relative grid min-h-[60vh] w-full grid-cols-1 justify-center bg-cover bg-center px-4 sm:grid-cols-6 sm:items-center sm:px-0"
          style={{
            backgroundImage: `url(${
              isMobile ? LandingPageBackgroundMobile : LandingPageBackground
            })`,
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInVariants}
        >
          <div className="col-span-1 hidden sm:block" />
          <div className="col-span-2 mt-12 w-full text-center text-white sm:mt-0">
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-extrabold uppercase sm:text-5xl">
                TREND COFFEE
              </div>
            </div>
            <p className="mt-4 text-sm sm:text-base">
              Hương vị đẳng cấp, khơi nguồn cảm hứng cho mọi khoảnh khắc.
            </p>
            <div className="mt-6 flex justify-center gap-4 sm:flex-row">
              <NavLink to={ROUTE.CLIENT_MENU}>
                <Button className="w-full">Thực đơn</Button>
              </NavLink>
              <Button variant="outline" className="bg-transparent text-white">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
          <div className="col-span-1 hidden sm:block" />
        </motion.div>

        {/* Section 2: Sản phẩm bán chạy */}
        <div className="container">
          <motion.div
            className="flex h-fit w-full flex-col items-start gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInVariants}
          >
            <div className="flex w-full justify-between">
              <div className="flex gap-2">
                <div className="rounded-full border border-primary bg-primary px-3 py-1 text-xs text-muted-foreground text-white sm:text-sm">
                  Sản phẩm bán chạy
                </div>
                <div className="rounded-full border px-3 py-1 text-xs text-muted-foreground sm:text-sm">
                  Sản phẩm mới
                </div>
              </div>
              <NavLink
                to={ROUTE.CLIENT_MENU}
                className="flex items-center justify-center rounded-md px-2 text-xs transition-all duration-200 hover:scale-105 hover:bg-primary/20 hover:text-primary sm:text-sm"
              >
                Xem thêm
              </NavLink>
            </div>
            <BestSellerCarousel />
          </motion.div>
        </div>

        {/* Section 3: Info */}
        <div className="container">
          <motion.div
            className="grid w-full grid-cols-1 items-start gap-4 p-4 sm:grid-cols-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInVariants}
          >
            <div className="flex justify-center sm:col-span-2">
              <div className="flex flex-col items-start gap-4 sm:w-2/3">
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-extrabold">TREND Coffee</span>
                  <span className="text-muted-foreground">
                    Không gian hiện đại, ấm cúng – nơi gắn kết những câu chuyện
                    và tạo nên kỷ niệm khó quên.
                  </span>
                </div>
                <NavLink
                  to={ROUTE.CLIENT_MENU}
                  className="flex rounded-md text-sm transition-all duration-200 hover:scale-105 hover:bg-primary/20"
                >
                  <Button>Tìm hiểu thêm</Button>
                </NavLink>
              </div>
            </div>
            <div className="flex justify-center sm:col-span-3">
              <div className="w-full sm:w-11/12">
                <StoreCarousel />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 4: More info */}
        <motion.div
          className="flex h-96 items-center bg-gray-900 px-4 text-white sm:justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInVariants}
        >
          <div className="container mx-auto text-center">
            <h2 className="text-2xl font-bold sm:text-4xl">
              Tìm hiểu thêm về chúng tôi
            </h2>
            <p className="mt-4 text-sm">
              Chúng tôi cung cấp các loại cà phê chất lượng cao với nguồn gốc rõ
              ràng. Hãy ghé thăm cửa hàng của chúng tôi!
            </p>
            <Button className="mt-6">Liên hệ</Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
