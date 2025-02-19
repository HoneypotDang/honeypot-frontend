import MemeHorseRace from "@/components/MemeWarBanner/MemeHorseRace";
import { motion } from "framer-motion";
import { itemPopUpVariants } from "@/lib/animation";
import { observer } from "mobx-react-lite";

const DerbyDashboard = observer(() => {
  return (
    <div className="w-full flex items-center justify-center pb-6 sm:pb-12 overflow-x-hidden">
      <div className="w-full xl:mx-auto xl:max-w-[1200px] px-8 xl:px-0 space-y-8">
        {/* Race Track Module */}
        <motion.div
          variants={itemPopUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="w-full bg-[#FFCD4D] relative py-8 sm:py-12 px-4 rounded-2xl overflow-hidden">
            <div className="bg-[url('/images/card-container/honey/top-border.svg')] bg-left-top h-6 absolute top-0 left-0 w-full bg-contain"></div>
            <MemeHorseRace showTable={false} />
            <div className="bg-[url('/images/card-container/honey/bottom-border.svg')] bg-left-top h-6 absolute -bottom-1 left-0 w-full bg-contain"></div>
          </div>
        </motion.div>

        {/* Table Module */}
        <motion.div
          variants={itemPopUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-[#FFCD4D] rounded-2xl overflow-hidden relative md:pt-12 pb-6 w-full">
            <div className="bg-[url('/images/pumping/outline-border.png')] bg-left-top h-4 md:h-12 absolute top-0 left-0 w-full bg-contain bg-repeat-x"></div>
            <div className="p-2 sm:p-6 w-full">
              <div className="bg-[#202020] rounded-2xl overflow-hidden w-full">
                <div className="p-2 sm:p-6 w-full">
                  <MemeHorseRace showRaceTrack={false} />
                </div>
              </div>
            </div>
            <div className="bg-[url('/images/card-container/honey/bottom-border.svg')] bg-top h-12 absolute -bottom-1 left-0 w-full bg-contain bg-repeat-x"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default DerbyDashboard;
